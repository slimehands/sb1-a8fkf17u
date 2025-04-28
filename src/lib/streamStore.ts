// src/lib/stores/streamLineStore.ts
import { readable } from 'svelte/store';

export function streamStore(stream: ReadableStream<Uint8Array>) {
  return readable<string>(undefined, (set) => {
    const decoder = new TextDecoderStream();
    const reader = stream.pipeThrough(decoder).getReader();

    let buffer = '';

    const read = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer) set(buffer); // emit remaining partial line
          break;
        }

        buffer += value;
        const parts = buffer.split('\n');
        buffer = parts.pop() ?? '';

        for (const line of parts) {
          set(line); // emit each line individually
        }
      }
    };

    read();

    return () => {
      reader.cancel();
    };
  });
}
