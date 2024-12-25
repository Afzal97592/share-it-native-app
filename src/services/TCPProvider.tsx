import 'react-native-get-random-values';
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import {useChunkStore} from '../db/chunkStore';

import TCPSocket from 'react-native-tcp-socket';
import DeviceInfo from 'react-native-device-info';
import {Alert, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {v4 as uuidv4} from 'uuid';
import {produce} from 'immer';
import {receivedChunkAck, receivedFilesAck, sendChunkAck} from './TCPUtils';

interface TCPContextType {
  server: any;
  client: any;
  isConnected: boolean;
  connectedDevice: any;
  sentFile: any;
  receivedFiles: any;
  totalSentBytes: number;
  totalReceivedBytes: number;
  startServer: (port: number) => void;
  connectToServer: (host: string, port: number, deviceName: string) => void;
  sendMessage: (message: string | Buffer) => void;
  sendFileAck: (file: any, type: 'file' | 'image') => void;
  disconnect: () => void;
}

const TCPContext = createContext<TCPContextType | undefined>(undefined);

export const useTCP = (): TCPContextType => {
  const context = useContext(TCPContext);
  if (!context) {
    throw new Error('useTCP must be used within a  TCPProvider');
  }
  return context;
};

const options = {
  keystore: require('../../tls_certs/server-keystore.p12'),
};

export const TCPProvider: FC<{children: React.ReactNode}> = ({children}) => {
  const [server, setServer] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [serverSocket, setServerSocket] = useState<any>(null);
  const [sentFile, setSentFile] = useState<any>([]);
  const [receivedFiles, setReceivedFiles] = useState<any>([]);
  const [totalSentBytes, setTotalSentBytes] = useState<number>(0);
  const [totalReceivedBytes, setTotalReceivedBytes] = useState<number>(0);

  const {currentChunkSet, setCurrentChunkSet, setChunkStore} = useChunkStore();

  //   START SERVER

  const startServer = useCallback(
    (port: number) => {
      if (server) {
        console.log('server already running!');
        return;
      }
      const newServer = TCPSocket.createTLSServer(options, socket => {
        console.log('Client connected!');
        setServerSocket(socket);
        socket.setNoDelay(true);
        socket.readableHighWaterMark = 1024 * 1024 * 1;

        socket.on('data', async data => {
          const parsedData = JSON.parse(data?.toString());
          if (parsedData?.event == 'connect') {
            setIsConnected(true);
            setConnectedDevice(parsedData?.deviceName);
          }
          if (parsedData?.event === 'file_ack') {
            receivedFilesAck(parsedData?.file, socket, setReceivedFiles);
          }
          if (parsedData?.event === 'send_chunk_ack') {
            sendChunkAck(
              parsedData?.chunkNo,
              socket,
              setTotalSentBytes,
              setSentFile,
            );
          }
          if (parsedData?.event === 'received_chunk_ack') {
            receivedChunkAck(
              parsedData?.chunk,
              parsedData?.chunkNo,
              socket,
              setTotalReceivedBytes,
              generateFile,
            );
          }
        });
        socket.on('close', () => {
          console.log('client disconnected!');
          setReceivedFiles([]);
          setSentFile([]);
          setCurrentChunkSet(null);
          setChunkStore(null);
          setTotalReceivedBytes(0);
          setTotalSentBytes(0);
          setIsConnected(false);
          disconnect();
        });
        socket.on('error', err => {
          console.log('Server error: ' + err);
        });
        newServer.listen({port, host: '0.0.0.0'}, () => {
          const address = newServer.address();
          console.log(`Server running on ${address?.address}:${address?.port}`);
        });
        newServer.on('error', err => {
          console.log('Server Error', err);
        });
        setServer(newServer);
      });
    },
    [server],
  );

  //   Start Client
  const connectToServer = useCallback(
    (host: string, port: number, deviceName: string) => {
      const newClient = TCPSocket.connectTLS(
        {
          host,
          port,
          cert: true,
          ca: require('../../tls_certs/server-cert.pem'),
        },
        () => {
          setIsConnected(true);
          setConnectedDevice(deviceName);
          const myDeviceName = DeviceInfo.getDeviceNameSync();
          newClient.write(
            JSON.stringify({event: 'connect', deviceName: myDeviceName}),
          );
        },
      );
      newClient.setNoDelay(true);
      newClient.readableHighWaterMark = 1024 * 1024 * 1;
      newClient.writableHighWaterMark = 1024 * 1024 * 1;
      newClient.on('data', async data => {
        const parsedData = JSON.parse(data?.toString());
        if (parsedData?.event === 'file_ack') {
          receivedFilesAck(parsedData?.file, newClient, setReceivedFiles);
        }
        if (parsedData?.event === 'send_chunk_ack') {
          sendChunkAck(
            parsedData?.chunkNo,
            newClient,
            setTotalSentBytes,
            setSentFile,
          );
        }
        if (parsedData?.event === 'received_chunk_ack') {
          receivedChunkAck(
            parsedData?.chunk,
            parsedData?.chunkNo,
            newClient,
            setTotalReceivedBytes,
            generateFile,
          );
        }
      });
      newClient.on('close', () => {
        console.log('connection close');
        setReceivedFiles([]);
        setSentFile([]);
        setCurrentChunkSet(null);
        setChunkStore(null);
        setTotalReceivedBytes(0);
        setTotalSentBytes(0);
        setIsConnected(false);
        disconnect();
      });
      newClient.on('error', err => {
        console.log('Client Error', err);
      });
      setClient(newClient);
    },
    [client],
  );

  //   Disconnect

  const disconnect = useCallback(() => {
    if (client) {
      client.destroy();
    }
    if (server) {
      server.close();
    }

    setReceivedFiles([]);
    setSentFile([]);
    setCurrentChunkSet(null);
    setChunkStore(null);
    setTotalReceivedBytes(0);
    setTotalSentBytes(0);
    setIsConnected(false);
  }, [client, server]);

  //   SEND MESSAGE

  const sendMessage = useCallback(
    (message: String | Buffer) => {
      if (client) {
        client.write(JSON.stringify(message));
        console.log('sent from client', message);
      } else if (server) {
        serverSocket?.write(JSON.stringify(message));
        console.log('sent from server', message);
      } else {
        console.error('No Client or Server Socket available');
      }
    },
    [client, server],
  );

  //  Send file Acknowledge

  const sendFileAck = useCallback(
    async (file: any, type: 'file' | 'image') => {
      if (currentChunkSet !== null) {
        Alert.alert('wait for current file to be sent!');
      }

      const normalizedPath =
        Platform.OS === 'ios' ? file?.uri?.replace('file://', '') : file?.uri;

      const fileData = await RNFS.readFile(normalizedPath, 'base64');
      const buffer = Buffer.from(fileData, 'base64');
      const CHUNK_SIZE = 1024 * 8;
      let totalChunks = 0;
      let offset = 0;
      let chunkArray = [];

      while (offset < buffer.length) {
        const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
        totalChunks += 1;
        chunkArray.push(chunk);
        offset += chunk.length;
      }
      const rawData = {
        id: uuidv4(),
        name: type === 'file' ? file?.name : file?.fileName,
        size: type === 'file' ? file?.size : file?.fileSize,
        mimeType: type === 'file' ? 'file' : '.jpg',
        totalChunks,
      };
      setCurrentChunkSet({
        id: rawData?.id,
        chunkArray,
        totalChunks,
      });
      setSentFile((prevData: any) => {
        produce(prevData, (draft: any) => {
          draft.push({
            ...rawData,
            uri: file?.uri,
          });
        });
      });
      const socket = client || serverSocket;
      if (!socket) return;
      try {
        console.log('File Acknowledge Done');
        socket.write(JSON.stringify({event: 'file_ack', data: rawData}));
      } catch (error) {
        console.error('Error sending files: ', error);
      }
    },
    [sendMessage],
  );

  //   GENERATE FILE

  const generateFile = async () => {
    const {chunkStore, resetChunkStore} = useChunkStore.getState();
    if (!chunkStore) {
      console.log('No Chunk or file files to process');
      return;
    }
    if (chunkStore?.totalChunks !== chunkStore.chucnkArray.length) {
      console.log('File chunks not received yet');
      return;
    }
    try {
      const combinedChunks = Buffer.concat(chunkStore.chucnkArray);
      const platformPath =
        Platform.OS === 'ios'
          ? `${RNFS.DownloadDirectoryPath}`
          : `${RNFS.DownloadDirectoryPath}`;

      const filePath = `${platformPath}/${chunkStore.name}`;
      await RNFS.writeFile(
        filePath,
        combinedChunks?.toString('base64'),
        'base64',
      );
      setReceivedFiles((prvFiles: any) =>
        produce(prvFiles, (draftFiles: any) => {
          const fileIndex = draftFiles?.findIndex(
            (f: any) => f.id === chunkStore.id,
          );
          if (fileIndex !== -1) {
            draftFiles[fileIndex] = {
              ...draftFiles[fileIndex],
              uri: filePath,
              available: true,
            };
          }
          Alert.alert(
            'File downloaded successfully',
            `Downloaded: ${filePath}`,
          );
        }),
      );
      console.log('File saved successfully!!', filePath);
      resetChunkStore();
    } catch (error) {
      console.error('Error generating files: ', error);
    }
  };

  return (
    <TCPContext.Provider
      value={{
        server,
        client,
        isConnected,
        connectedDevice,
        sentFile,
        receivedFiles,
        totalSentBytes,
        totalReceivedBytes,
        startServer,
        connectToServer,
        disconnect,
        sendMessage,
        sendFileAck,
      }}>
      {children}
    </TCPContext.Provider>
  );
};
