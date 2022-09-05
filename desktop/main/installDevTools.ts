import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import { isDebug } from '../utils';

export default async () => {
  if (!isDebug()) return;
  await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], {
    loadExtensionOptions: { allowFileAccess: true },
    forceDownload: false,
  }).then(
    (names) =>
      // eslint-disable-next-line no-console
      console.log(
        'DevTools Installed:',
        names,
        'issue with Electron sandbox_bundle.js and TypeError  because of devtools in dev mode'
      ),
    (err) => console.log('DevTools Installation Error:', err) // eslint-disable-line no-console
  );
};
