import * as sm from '@spacemesh/sm-codec';
import prompts from 'prompts';
import { SingleSigMethods } from '../shared/templateConsts';

(async () => {
  // Inputs
  const inputs = await prompts([
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
      type: 'text',
      name: 'rawTx',
      message: 'Put here raw transaction (in format `0, 0, 0, 0, 0, 0, 227, ..., 23`)',
    },
  ], {
    onCancel: () => {
      console.log('Composing transaction cancelled');
      process.exit(0);
    }
  });

  // SCRIPT
  const tpl = sm.TemplateRegistry.get(inputs.templateAddress, inputs.method);
  const bytes = Uint8Array.from(
    JSON.parse(
      `[${inputs.rawTx.replace('[', '').replace(']', '')}]`
    )
  );

  console.dir(tpl.decode(bytes), { depth: null, colors: true });
})();
