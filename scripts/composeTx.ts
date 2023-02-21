import * as sm from '@spacemesh/sm-codec';
import Bech32 from '@spacemesh/address-wasm';
import prompts from 'prompts';

import { sign } from '../desktop/ed25519';
import { fromHexString } from '../shared/utils';
import { generateGenesisID } from "../desktop/main/Networks";

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
      name: 'genesisTime',
      message: 'Genesis Time',
      validate: (val) => Boolean(new Date(val)),
    },
    {
      type: 'text',
      name: 'genesisExtraData',
      message: 'Genesis Extra Data',
      validate: (val) => Boolean(new Date(val)),
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
        { title: 'SelfSpawn', value: SingleSigMethods.Spawn },
        { title: 'Spend', value: SingleSigMethods.Spend },
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
    if (inputs.method === SingleSigMethods.Spawn) {
      // SELF-SPAWN TRANSACTION
      return tpl.encode(principal, {
        Nonce: BigInt(inputs.nonce),
        GasPrice: BigInt(inputs.gas),
        Arguments: spawnArg,
      });
    }
    else if (inputs.method === SingleSigMethods.Spend) {
      // SPEND TRANSACTION
      return tpl.encode(principal, {
        Nonce: BigInt(inputs.nonce),
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
    const { genesisTime, genesisExtraData } = inputs
    const genesisID = generateGenesisID((new Date(genesisTime)).toString(), genesisExtraData)
    const hash = sm.hash(new Uint8Array([...genesisID, ...encodedTx]));
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
