import { ipcMain } from 'electron';
import { ipcConsts } from '../../app/vars';
import { GenericPromptOpts } from '../../shared/genericPrompt';
import { GenericModalOpts } from '../../shared/genericModal';

export const showGenericPrompt = (
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

export const showGenericModal = (
  webContents: Electron.WebContents,
  opts: GenericModalOpts
) => {
  webContents.send(ipcConsts.GENERIC_MODAL_SHOW, opts);
  return true;
};

export const hideGenericModal = (webContents: Electron.WebContents) => {
  webContents.send(ipcConsts.GENERIC_MODAL_HIDE);
};
