import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send(channel: Channels, ...args: any[]): void;
        on(
          channel: Channels,
          func: (...args: any[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: any[]) => void): void;
        invoke<Return>(channel: Channels, ...args: any[]): Promise<Return>
      };
    };
  }
}

export {};
