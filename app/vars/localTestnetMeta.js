// TODO: Local Testnet purposes only

const accounts = {
  almog: {
    pk: '4d05cfede9928bcd225c008db8110cfeb1f01011e118bdb93f1bb14d2052c276',
    sk: '48dc32104006e7a85c53eeb80cd54dd218d8b66908ad5a9a12bee7b6c01461904d05cfede9928bcd225c008db8110cfeb1f01011e118bdb93f1bb14d2052c276',
    ip: '127.0.0.1:9080'
  },
  anton: {
    pk: 'db58184012f26c405bff2d8866bf7ef2d1da7f0b391d1f1364f1d695929df617',
    sk: 'af94f1477c0325e5b790178e110cb1f51537589f1726edaaf8cacd385145d289db58184012f26c405bff2d8866bf7ef2d1da7f0b391d1f1364f1d695929df617',
    ip: '127.0.0.1:9081'
  },
  gavrad: {
    pk: '0dc90fe42d96e302ae122aa3437e320d792772aba8f459f80e18a45ae754112d',
    sk: '19bf601036b2a1770ff1ce359d76119a03fbfee91d9fc2d870bc37e34dc2d9890dc90fe42d96e302ae122aa3437e320d792772aba8f459f80e18a45ae754112d',
    ip: '127.0.0.1:9082'
  },
  yosher: {
    pk: '39a27e846f7e9783cd8fcae0f94abe7ba1428df096e13e903ef5b9df85d520e1',
    sk: '8bab7df1f55b1f0160e130abc1e3d7c5985345a3c1f8e6d3f7b4b1defad3b67439a27e846f7e9783cd8fcae0f94abe7ba1428df096e13e903ef5b9df85d520e1',
    ip: '127.0.0.1:9084'
  }
};

const localTestnetMeta = {
  accounts,
  selectedAccount: 'almog',
  isLocalTestnet: true // false will use account with selected account index
};

export default localTestnetMeta;
