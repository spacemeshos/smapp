import { ipcMain } from 'electron';
import { ipcConsts } from '../../app/vars';

interface SendPromptToRendererInput {
  title: string;
  message: string;
}

export default (
  event: Electron.IpcMainInvokeEvent,
  { title, message }: SendPromptToRendererInput
): Promise<boolean> => {
  event.sender.send(ipcConsts.PROMPT_MODAL_REQUEST, { title, message });
  return new Promise((resolve) =>
    ipcMain.once(ipcConsts.PROMPT_MODAL_REQUEST, (_, userResponse) =>
      resolve(userResponse)
    )
  );
};
