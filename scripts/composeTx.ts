import * as sm from '@spacemesh/sm-codec';
import Bech32 from '@spacemesh/address-wasm';
import prompts from 'prompts';

import { sign } from '../desktop/ed25519';
import { fromHexString } from '../shared/utils';
import { sha256 } from '@spacemesh/sm-codec/lib/utils/crypto';

(async () => {
  // Inputs
  const inputs = await prompts([
    {
      type: 'select',
      name: 'hrp',
      message: 'Choose HRP Network',
      initial: 0,
      choices: [
        { title: 'TestNet', value: 'stest' },
        { title: 'MainNet', value: 'sm' },
      ],
    },
    {
      type: 'text',
      name: 'secretKey',
      message: 'Type the secretKey or publicKey (if you do not need to sign tx)',
      validate: (val) => val.length >= 64,
    },
    {
      type: 'select',
      name: 'templateAddress',
      message: 'Choose the template',
      choices: [
        { title: 'SingleSig', value: sm.SingleSigTemplate.key },
      ],
    },
    {
      type: prev => prev === sm.SingleSigTemplate.key ? 'select' : null,
      name: 'method',
      message: 'Choose the method',
      choices: [
        { title: 'SelfSpawn', value: 0 },
        { title: 'Spend', value: 1 },
      ],
    },
    {
      type: (_, values) => values.templateAddress === sm.SingleSigTemplate.key && values.method === 1 ? 'text' : null,
      name: 'spendDestination',
      message: 'Type the destination address (Bech32)'
    },
    {
      type: (_, values) => values.templateAddress === sm.SingleSigTemplate.key && values.method === 1 ? 'number' : null,
      name: 'spendAmount',
      message: 'Type the amount to send (in Smidge)',
      validate: (val) => val > 0,
    },
    {
      type: 'number',
      name: 'nonce',
      message: 'Define a nonce counter',
      initial: 0,
      validate: (val) => val >= 0,
    },
    {
      type: 'number',
      name: 'gas',
      message: 'Define a gas fee',
      initial: 1,
      validate: (val) => val >= 1,
    },
    {
      type: 'confirm',
      name: 'doSign',
      message: 'Sign transaction?',
      initial: true,
    },
  ], {
    onCancel: () => {
      console.log('Composing transaction cancelled');
      process.exit(0);
    }
  });

  // SCRIPT
  Bech32.setHRPNetwork(inputs.hrp);

  const publicKey = inputs.secretKey.substring(inputs.secretKey.length-64);
  const tpl = sm.TemplateRegistry.get(inputs.templateAddress, inputs.method);
  const spawnArg = {
    PublicKey: fromHexString(publicKey),
  };
  const principal = tpl.principal(spawnArg);
  const principalAddress = Bech32.generateAddress(principal);
  console.log('Principal address: ', principalAddress);

  const logBytes = (name: string, bytes: Uint8Array) =>
    console.log(`${name} (${bytes.length}): [${bytes.join(', ')}]`);

  const composeTx = () => {
    if (inputs.templateAddress !== sm.SingleSigTemplate.key) {
      throw new Error('Script supports only composing TXs for SingleSig Account');
    }
    if (inputs.method === 0) {
      // SELF-SPAWN TRANSACTION
      return tpl.encode(principal, {
        Nonce: {
          Counter: BigInt(inputs.nonce),
          Bitfield: BigInt(0),
        },
        GasPrice: BigInt(inputs.gas),
        Arguments: spawnArg,
      });
    }
    else if (inputs.method === 1) {
      // SPEND TRANSACTION
      return tpl.encode(principal, {
        Nonce: {
          Counter: BigInt(inputs.nonce),
          Bitfield: BigInt(0),
        },
        GasPrice: BigInt(inputs.gas),
        Arguments: {
          Destination: Bech32.parse(inputs.spendDestination),
          Amount: BigInt(inputs.spendAmount),
        },
      })
    }
    throw new Error('Unknown method');
  }

  const encodedTx = composeTx();
  logBytes('encodedTx', encodedTx);

  if (inputs.doSign) {
    const hash = sha256(encodedTx);
    const sig = sign(hash, inputs.secretKey);
    logBytes('signature', sig);
    const signed = tpl.sign(encodedTx, sig);
    logBytes('signedTx', signed);

    console.log('Verify...');
    console.dir(tpl.decode(signed), { depth: null, colors: true });
  } else {
    console.log('Verify...');
    console.dir(tpl.decode(encodedTx), { depth: null, colors: true });
  }
})();