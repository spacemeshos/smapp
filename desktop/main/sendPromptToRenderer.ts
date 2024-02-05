import { ipcMain } from 'electron';
import { ipcConsts } from '../../app/vars';
import { GenericPromptOpts } from '../../shared/SendPromptToRendererInput';

export default (
  webContents: Electron.WebContents,
  opts: GenericPromptOpts
): Promise<boolean> => {
  webContents.send(ipcConsts.PROMPT_MODAL_REQUEST, opts);
  return new Promise((resolve) =>
    ipcMain.once(ipcConsts.PROMPT_MODAL_REQUEST, (_, userResponse) =>
      resolve(userResponse)
    )
  );
};
