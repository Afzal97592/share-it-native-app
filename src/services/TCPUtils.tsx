import {produce} from 'immer';
import {Alert} from 'react-native';
import {Buffer} from 'buffer';
import {useChunkStore} from '../db/chunkStore';

export const receivedFilesAck = async (
  data: any,
  socket: any,
  setReceivedFiles: any,
) => {
  const {setChunkStore, chunkStore} = useChunkStore.getState();
  if (chunkStore) {
    Alert.alert('There are files which need to be received wait ');
    return;
  }
  setReceivedFiles((prevData: any) => {
    produce(prevData, (draft: any) => {
      draft.push(data);
    });
  });
  setChunkStore({
    id: data?.id,
    totalChunks: data?.totalChunks,
    name: data?.name,
    size: data?.size,
    mimeType: data?.mimeType,
    chunkArray: [],
  });
  if (!socket) {
    console.log('Socket not available');
    return;
  }
  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log('File received');
    socket.write(JSON.stringify({event: 'send_chunk_ack', chunkNo: 0}));
    console.log('Requested for first chunk');
  } catch (error) {
    console.error('Error sending file', error);
  }
};

export const sendChunkAck = async (
  chunkIndex: any,
  socket: any,
  setTotalSentBytes: any,
  setSentFile: any,
) => {
  const {currentChunkSet, resetCurrentChunkSet} = useChunkStore.getState();
  if (!currentChunkSet) {
    Alert.alert('There are no chunk to be sent');
    return;
  }
  if (!socket) {
    console.error('Socket not available');
    return;
  }
  const totalChunks = currentChunkSet?.totalChunks;
  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    socket.write(
      JSON.stringify({
        event: 'receive_chunk_ack',
        chunk: currentChunkSet.chucnkArray[chunkIndex].toString('base64'),
        chunkNo: chunkIndex,
      }),
    );
    setTotalSentBytes(
      (prev: number) => prev + currentChunkSet.chucnkArray[chunkIndex]?.length,
    );
    if (chunkIndex + 2 > totalChunks) {
      console.log('all chunks sent successfully!');
      setSentFile((prevFiles: any) => {
        produce(prevFiles, (draftFiles: any) => {
          const fileIndex = draftFiles?.findIndex(
            (f: any) => f.id === currentChunkSet.id,
          );
          if (fileIndex !== -1) {
            draftFiles[fileIndex].available = true;
          }
        });
      });
      resetCurrentChunkSet();
    }
  } catch (error) {
    console.error('Error sending file', error);
  }
};

export const receivedChunkAck = async (
  chunk: any,
  chunkNo: any,
  socket: any,
  setTotalReceivedBytes: any,
  generateFiles: any,
) => {
  const {chunkStore, resetChunkStore, setChunkStore} = useChunkStore.getState();
  if (!chunkStore) {
    console.log('Chunk Store is null');
    return;
  }
  try {
    const bufferChunk = Buffer.from(chunk, 'base64');
    const updatedChunkArray = [...(chunkStore.chucnkArray || [])];
    updatedChunkArray[chunkNo] = bufferChunk;
    setChunkStore({...chunkStore, chucnkArray: updatedChunkArray});
    setTotalReceivedBytes((prev: number) => prev + bufferChunk.length);
  } catch (error) {
    console.log('error updating chunk', error);
  }

  if (!socket) {
    console.log('Socket not available');
    return;
  }
  if (chunkNo + 1 === chunkStore?.totalChunks) {
    console.log('All chunks received');
    generateFiles();
    resetChunkStore();
    return;
  }
  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log('Request for next chunk ', chunkNo + 1);
    socket.write(
      JSON.stringify({event: 'send_chunk_ack', chunkNo: chunkNo + 1}),
    );
  } catch (error) {
    console.log('Error:', error);
  }
};
