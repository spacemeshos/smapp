import prompts from 'prompts';
import fs from 'fs';
import { decryptWallet, saveWallet } from '../desktop/main/walletFile';
import { KeyPair, WalletFile, WalletSecrets } from '../shared/types';
import { getISODate } from '../shared/datetime';

(async () => {
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
    },
    {
      type: 'text',
      name: 'displayName',
      message: 'Name for new account',
    },
    {
      type: 'text',
      name: 'publicKey',
      message: 'PublicKey in HEX format',
    }
  ],
  {
    onCancel: () => {
      console.log('Write wallet file cancelled');
      process.exit(0);
    },
  });

  try {
    
    const wallet = JSON.parse(
      fs.readFileSync(inputs.walletpath, 'utf-8')
    ) as WalletFile;

    const secrets = await decryptWallet(wallet.crypto, inputs.password);

    const newAccount: KeyPair = {
      displayName: inputs.displayName,
      publicKey: inputs.publicKey,
      path: '',
      secretKey: '',
      created: getISODate(),
    };

    const newSecrets: WalletSecrets = {
      ...secrets,
      accounts: [...secrets.accounts, newAccount],
    };

    await saveWallet(inputs.walletpath, inputs.password, {
      ...wallet,
      crypto: newSecrets,
    });

    process.stdout.write('Done!');
    process.exit(0);
  } catch (err) {
    process.stderr.write('Can not decode wallet file\n');
    console.error(err);
    process.exit(1);
  }
})();
