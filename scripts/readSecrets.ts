import prompts from 'prompts';
import fs from 'fs';
import { WalletFile } from '../shared/types';
import { decryptWallet } from '../desktop/main/walletFile';

(async () => {
  console.log('Attention!');
  console.log('This tool will output secrets in stdout, which might be unsafe');
  console.log('Use it on your own risk');

  const inputs = await prompts([
    {
      type: 'text',
      name: 'walletpath',
      message: 'Absolute path to the wallet file',
      validate: (val) => {
        try {
          return fs.statSync(val).isFile()
        } catch (err) { 
          return false;
        }
      },
    },
    {
      type: 'password',
      name: 'password',
      message: 'Type password',
    }
  ],
  {
    onCancel: () => {
      console.log('Reading wallet file secrets cancelled');
      process.exit(0);
    },
  });

  try {
    const wallet = JSON.parse(
      fs.readFileSync(inputs.walletpath, 'utf-8')
    ) as WalletFile;

    decryptWallet(wallet.crypto, inputs.password).then(
      (secrets) => {
        console.dir(secrets, { depth: null, colors: true });
        process.exit(0);
      }
    );
  } catch (err) {
    process.stderr.write('Can not decode wallet file\n');
    console.error(err);
    process.exit(1);
  }
})();
