export const defaultDiscoveryConfig = {
  api: {
    'grpc-public-services': [
      'debug',
      'global',
      'mesh',
      'node',
      'transaction',
      'activation',
    ],
    'grpc-public-listener': '0.0.0.0:9092',
    'grpc-private-services': ['smesher', 'admin'],
    'grpc-private-listener': '0.0.0.0:9093',
    'grpc-json-listener': '0.0.0.0:9094',
  },
  preset: 'testnet',
  p2p: {
    'disable-reuseport': true,
    bootnodes: [],
  },
  main: {
    'layer-duration': '5m',
    'layers-per-epoch': 576,
    'tick-size': 1036800,
    'block-gas-limit': 1000000,
    'eligibility-confidence-param': 100,
    'poet-server': [],
  },
  genesis: {
    'genesis-time': '2023-05-31T20:00:00.498Z',
    'genesis-extra-data': 'testnet-05',
  },
  poet: {
    'phase-shift': '12h',
    'cycle-gap': '12h',
    'grace-period': '1h',
    'retry-delay': '10s',
  },
  logging: {
    nipostBuilder: 'debug',
    post: 'debug',
  },
  post: {
    'post-labels-per-unit': 536870912,
    'post-max-numunits': 1000,
    'post-min-numunits': 4,
    'post-k1': 26,
    'post-k2': 37,
    'post-k3': 37,
    'post-k2pow-difficulty': 89157696150400,
    'post-pow-difficulty':
      '001bf647612f3696000000000000000000000000000000000000000000000000',
  },
  hare: {
    'hare-wakeup-delta': '25s',
    'hare-round-duration': '25s',
    'hare-limit-iterations': 4,
    'hare-committee-size': 200,
  },
  tortoise: {
    'tortoise-zdist': 2,
    'tortoise-hdist': 2,
    'tortoise-window-size': 10000,
    'tortoise-delay-layers': 100,
  },
  beacon: {
    'beacon-grace-period-duration': '10m',
    'beacon-proposal-duration': '4m',
    'beacon-first-voting-round-duration': '30m',
    'beacon-rounds-number': 200,
    'beacon-voting-round-duration': '4m',
    'beacon-weak-coin-round-duration': '4m',
  },
  bootstrap: {
    'bootstrap-url': 'https://bootstrap.spacemesh.network/testnet-05',
  },
  recovery: {
    'recovery-uri':
      'https://recovery.spacemesh.network/testnet-05/snapshot-6264',
    'recovery-layer': 6270,
    'preserve-own-atx': false,
  },
};

export const defaultDiscoveryConfigDevnet = {
  ...defaultDiscoveryConfig,
  genesis: {
    'genesis-time': '2023-05-29T15:00:00.498Z',
    'genesis-extra-data': 'devnet-401-short',
  },
};

export const defaultNodeConfig = {
  smeshing: {
    'smeshing-opts': {
      'smeshing-opts-datadir': '/Users/dir/post/7f8f332c',
    },
  },
  api: {
    'grpc-public-services': [
      'debug',
      'global',
      'mesh',
      'node',
      'transaction',
      'activation',
    ],
    'grpc-public-listener': '0.0.0.0:9092',
    'grpc-private-services': ['smesher', 'admin'],
    'grpc-private-listener': '0.0.0.0:9093',
    'grpc-json-listener': '0.0.0.0:9094',
  },
  preset: 'testnet',
  p2p: {
    'disable-reuseport': true,
    bootnodes: [
      '/dns4/testnet-05-bootnode-0.spacemesh.network/tcp/5000/p2p/12D3KooWQMAAL9nkgXJgTM2psJLMbWRgZLjAxJozx7dNkKYczs2V',
      '/dns4/testnet-05-bootnode-1.spacemesh.network/tcp/5000/p2p/12D3KooWF2bhnqsnu2UjxJGZs8KCbzvd91vnud29KaG9rzTNFH78',
      '/dns4/testnet-05-bootnode-2.spacemesh.network/tcp/5000/p2p/12D3KooWQKosE9LZraMfFPg9QRYyKwxT4ipsar37oT6wRy8WqWos',
      '/dns4/testnet-05-bootnode-3.spacemesh.network/tcp/5000/p2p/12D3KooWKMQ5j15x2gzfXfX7uisss7uwkPnqJyoHcfyiYfHgSo3F',
      '/dns4/testnet-05-bootnode-4.spacemesh.network/tcp/5000/p2p/12D3KooWE1YEa3roqamhPt3CNiVRBzS7Lbv8HRbByE7fpSyLAZis',
      '/dns4/testnet-05-bootnode-5.spacemesh.network/tcp/5000/p2p/12D3KooWFCqyEner8hSnBmyQCkcxkuHjwY5BhHTaRYmGuNC1SQET',
      '/dns4/testnet-05-bootnode-6.spacemesh.network/tcp/5000/p2p/12D3KooWA96fvi2pQaQHpS2cpahDJCyQSsBW6A4KwHCPXsDVuiEJ',
      '/dns4/testnet-05-bootnode-7.spacemesh.network/tcp/5000/p2p/12D3KooWRvAVZrK3EURQBh1wdMPRDgjtowU84div3YxWYKuGDaFU',
      '/dns4/testnet-05-bootnode-8.spacemesh.network/tcp/5000/p2p/12D3KooWL3VGmZ4xgT1J5KnVJz7b6wxAUUFAVqNNRURKFfWNXLE4',
      '/dns4/testnet-05-bootnode-9.spacemesh.network/tcp/5000/p2p/12D3KooWCfadA8PUva7eRn1GzdLhnfELRLu81s1na6JbdYivwBgs',
    ],
  },
  main: {
    'layer-duration': '5m',
    'layers-per-epoch': 576,
    'tick-size': 1036800,
    'block-gas-limit': 1000000,
    'eligibility-confidence-param': 100,
    'poet-server': [
      'https://testnet-05-poet-0.spacemesh.network',
      'https://testnet-05-poet-1.spacemesh.network',
      'https://testnet-05-poet-2.spacemesh.network',
      'https://poet-11.spacemesh.network',
    ],
  },
  genesis: {
    'genesis-time': '2023-05-31T20:00:00.498Z',
    'genesis-extra-data': 'testnet-05',
  },
  poet: {
    'phase-shift': '12h',
    'cycle-gap': '12h',
    'grace-period': '1h',
    'retry-delay': '10s',
  },
  logging: {
    nipostBuilder: 'debug',
    post: 'debug',
  },
  post: {
    'post-labels-per-unit': 536870912,
    'post-max-numunits': 1000,
    'post-min-numunits': 4,
    'post-k1': 26,
    'post-k2': 37,
    'post-k3': 37,
    'post-k2pow-difficulty': 89157696150400,
    'post-pow-difficulty':
      '001bf647612f3696000000000000000000000000000000000000000000000000',
  },
  hare: {
    'hare-wakeup-delta': '25s',
    'hare-round-duration': '25s',
    'hare-limit-iterations': 4,
    'hare-committee-size': 200,
  },
  tortoise: {
    'tortoise-zdist': 2,
    'tortoise-hdist': 2,
    'tortoise-window-size': 10000,
    'tortoise-delay-layers': 100,
  },
  beacon: {
    'beacon-grace-period-duration': '10m',
    'beacon-proposal-duration': '4m',
    'beacon-first-voting-round-duration': '30m',
    'beacon-rounds-number': 200,
    'beacon-voting-round-duration': '4m',
    'beacon-weak-coin-round-duration': '4m',
  },
  bootstrap: {
    'bootstrap-url': 'https://bootstrap.spacemesh.network/testnet-05',
  },
  recovery: {
    'recovery-uri':
      'https://recovery.spacemesh.network/testnet-05/snapshot-6264',
    'recovery-layer': 6270,
    'preserve-own-atx': false,
  },
};

export const customConfigWithNoSpecifiedLogging = {
  logging: {
    nipostBuilder: 'info',
  },
};

export const smeshingOptsFromStoreService = {
  smeshing: {
    'smeshing-opts': {
      'smeshing-opts-datadir': '/Users/max/post/data',
      'smeshing-opts-maxfilesize': 2147483648,
      'smeshing-opts-numunits': 4,
      'smeshing-opts-provider': 0,
      'smeshing-opts-throttle': false,
      'smeshing-opts-compute-batch-size': 1048576,
    },
    'smeshing-coinbase': 'stest1qqqqqqpx76g4dg297uqu6jaxaz0d4yfxjy5ufacpztqwf',
    'smeshing-proving-opts': {
      'smeshing-opts-proving-nonces': 288,
      'smeshing-opts-proving-threads': 9,
    },
    'smeshing-start': true,
  },
};

export const defaultSmeshingOpts = {
  'smeshing-opts': {
    'smeshing-opts-datadir': '/Users/max/post/data',
  },
};

export const defaultNodeConfigWithInitSmeshing = {
  ...defaultNodeConfig,
  smeshing: smeshingOptsFromStoreService,
};
