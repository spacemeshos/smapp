import {
  isWalletSecretsEncrypted,
  isWalletGCMEncrypted,
  isWalletLegacyEncrypted,
  isWalletSecrets,
  isWalletMeta,
  hasRequiredTxFields,
  hasRequiredTxStateFields,
  hasRequiredRewardFields,
  isTx,
  isReward,
  isActivation,
  isNodeError,
  isGenesisIDMissing,
  isApiMissing,
} from '../../../shared/types/guards';

describe('Type Guards', () => {
  describe('hasRequiredTxFields', () => {
    it('should return true for valid Transaction__Output', () => {
      const validTx = {
        id: Buffer.from('some-id'),
        principal: { address: 'some-address' },
        template: { address: 'some-template' },
        method: 1,
        nonce: { value: 0 },
        limits: { gasLimit: 100, feeLimit: 1000 },
        maxGas: 10000,
        gasPrice: 10,
        maxSpend: 1000,
        raw: Buffer.from('raw-data'),
      };

      // omit types for tests
      expect(hasRequiredTxFields(validTx as any)).toBe(true);
    });

    it('should return false for Transaction__Output with missing fields', () => {
      const invalidTx = {
        id: Buffer.from('some-id'),
        // Missing principal and template fields
      };

      // omit types for tests
      expect(hasRequiredTxFields(invalidTx as any)).toBe(false);
    });
  });

  describe('hasRequiredTxStateFields', () => {
    it('should return true for valid TransactionState__Output', () => {
      const validTxState = {
        id: { id: Buffer.from('some-id') },
        state: 1,
      };

      expect(hasRequiredTxStateFields(validTxState)).toBe(true);
    });

    it('should return false for TransactionState__Output with missing fields', () => {
      const invalidTxState = {
        // Missing id field
        state: 1,
      };

      // omit types for tests
      expect(hasRequiredTxStateFields(invalidTxState as any)).toBe(false);
    });
  });

  describe('hasRequiredRewardFields', () => {
    it('should return true for valid Reward__Output', () => {
      const validReward = {
        layer: { number: 1 },
        total: { value: '100' },
        layerReward: { value: '10' },
        layerComputed: { number: 1 },
        coinbase: { address: 'some-address' },
        smesher: { id: Buffer.from('smesher-id') },
      };

      expect(hasRequiredRewardFields(validReward)).toBe(true);
    });

    it('should return false for Reward__Output with missing fields', () => {
      const invalidReward = {
        layer: { number: 1 },
        total: { value: '100' },
        // Missing layerReward and coinbase fields
      };

      expect(hasRequiredRewardFields(invalidReward)).toBe(false);
    });
  });

  describe('isTx', () => {
    it('should return true for valid Tx', () => {
      const validTx = {
        id: 'some-id',
        principal: 'some-principal',
        template: 'some-template',
        method: 1,
        status: 6,
        payload: 'some-payload',
        gas: {
          gasPrice: 10,
          maxGas: 10000,
          fee: 100,
        },
        layer: 1,
        note: 'some-note',
        receipt: {
          fee: 100,
        },
      };

      expect(isTx(validTx)).toBe(true);
    });

    it('should return false for invalid Tx', () => {
      const invalidTx = {
        // Missing some required fields
        id: 'some-id',
        principal: 'some-principal',
        template: 'some-template',
      };

      expect(isTx(invalidTx)).toBe(false);
    });
  });

  describe('isReward', () => {
    it('should return true for valid Reward', () => {
      const validReward = {
        coinbase: 'some-coinbase',
        layer: 1,
        amount: 100,
        layerReward: 10,
        layerComputed: 1,
      };

      expect(isReward(validReward)).toBe(true);
    });

    it('should return false for invalid Reward', () => {
      const invalidReward = {
        // Missing some required fields
        coinbase: 'some-coinbase',
        layer: 1,
      };

      expect(isReward(invalidReward)).toBe(false);
    });
  });

  describe('isActivation', () => {
    it('should return true for valid Activation', () => {
      const validActivation = {
        id: Uint8Array.from([1, 2, 3]),
        smesherId: Uint8Array.from([4, 5, 6]),
        coinbase: Uint8Array.from([7, 8, 9]),
        prevAtx: null,
        layer: 1,
        numUnits: 10,
      };

      expect(isActivation(validActivation)).toBe(true);
    });

    it('should return false for invalid Activation', () => {
      const invalidActivation = {
        // Missing some required fields
        id: Uint8Array.from([1, 2, 3]),
        layer: 1,
      };

      expect(isActivation(invalidActivation)).toBe(false);
    });
  });

  describe('isNodeError', () => {
    it('should return true for valid NodeError', () => {
      const validNodeError = {
        level: 2,
        module: 'some-module',
        msg: 'some-message',
        stackTrace: 'stack-trace',
        type: 1,
      };

      expect(isNodeError(validNodeError)).toBe(true);
    });

    it('should return false for invalid NodeError', () => {
      const invalidNodeError = {
        // Missing some required fields
        level: 2,
        module: 'some-module',
      };

      expect(isNodeError(invalidNodeError)).toBe(false);
    });
  });
});

describe('Type Guards for Wallet', () => {
  describe('isWalletSecretsEncrypted', () => {
    it('should return true for valid WalletSecretsEncrypted', () => {
      const validEncryptedWallet = {
        cipher: 'AES-GCM',
        cipherText: 'encrypted-data',
      };

      expect(isWalletSecretsEncrypted(validEncryptedWallet)).toBe(true);
    });

    it('should return false for invalid WalletSecretsEncrypted', () => {
      const invalidEncryptedWallet = {
        // Missing cipherText
        cipher: 'AES-GCM',
      };

      expect(isWalletSecretsEncrypted(invalidEncryptedWallet)).toBe(false);
    });
  });

  describe('isWalletGCMEncrypted', () => {
    it('should return true for valid WalletSecretsEncryptedGCM', () => {
      const validGCMEncryptedWallet = {
        cipher: 'AES-GCM',
        cipherText: 'encrypted-data',
        kdf: 'PBKDF2',
        kdfparams: {
          dklen: 32,
          hash: 'SHA-512',
          iterations: 10000,
          salt: 'salt-value',
        },
        cipherParams: {
          iv: 'iv-value',
        },
      };

      expect(isWalletGCMEncrypted(validGCMEncryptedWallet)).toBe(true);
    });

    it('should return false for invalid WalletSecretsEncryptedGCM', () => {
      const invalidGCMEncryptedWallet = {
        cipher: 'AES-GCM',
        cipherText: 'encrypted-data',
        // Missing cipherParams
      };

      expect(isWalletGCMEncrypted(invalidGCMEncryptedWallet)).toBe(false);
    });
  });

  describe('isWalletLegacyEncrypted', () => {
    it('should return true for valid WalletSecretsEncryptedLegacy', () => {
      const validLegacyEncryptedWallet = {
        cipher: 'AES-128-CTR',
        cipherText: 'encrypted-data',
      };

      expect(isWalletLegacyEncrypted(validLegacyEncryptedWallet)).toBe(true);
    });

    it('should return false for invalid WalletSecretsEncryptedLegacy', () => {
      const invalidLegacyEncryptedWallet = {
        // Missing cipherText
        cipher: 'AES-128-CTR',
      };

      expect(isWalletLegacyEncrypted(invalidLegacyEncryptedWallet)).toBe(false);
    });
  });

  describe('isWalletSecrets', () => {
    it('should return true for valid WalletSecrets', () => {
      const validWalletSecrets = {
        mnemonic: 'some-mnemonic',
        accounts: ['account1', 'account2'],
        contacts: ['contact1', 'contact2'],
      };

      expect(isWalletSecrets(validWalletSecrets)).toBe(true);
    });

    it('should return false for invalid WalletSecrets', () => {
      const invalidWalletSecrets = {
        // Missing accounts
        mnemonic: 'some-mnemonic',
      };

      expect(isWalletSecrets(invalidWalletSecrets)).toBe(false);
    });
  });

  describe('isWalletMeta', () => {
    it('should return true for valid WalletMeta', () => {
      const validMeta = {
        displayName: 'Wallet',
        created: '2023-01-01',
        remoteApi: 'v1',
        type: 'type1',
      };

      // ignore WalletMeta type for test
      expect(isWalletMeta(validMeta as any)).toBe(true);
    });

    it('should return false for invalid WalletMeta', () => {
      const invalidMeta = {
        // Missing created field
        displayName: 'Wallet',
        remoteApi: 'v1',
        type: 'type1',
      };

      // ignore WalletMeta type for test
      expect(isWalletMeta(invalidMeta as any)).toBe(false);
    });
  });

  describe('isGenesisIDMissing', () => {
    it('should return false when genesisID is present', () => {
      const walletWithGenesisID = {
        meta: {
          displayName: 'Wallet',
          created: '2023-01-01',
          genesisID: 'some-genesis-id',
          remoteApi: 'http://localhost:1234',
          type: 'type1',
        },
      };
      expect(isGenesisIDMissing(walletWithGenesisID as any)).toBe(false);
    });

    it('should return true when genesisID is missing', () => {
      const walletWithoutGenesisID = {
        meta: {
          displayName: 'Wallet',
          created: '2023-01-01',
          genesisID: '',
          remoteApi: 'http://localhost:1234',
          type: 'type1',
        },
      };
      expect(isGenesisIDMissing(walletWithoutGenesisID as any)).toBe(true);
    });
  });

  describe('isApiMissing', () => {
    it('should return false when remoteApi is present', () => {
      const walletWithApi = {
        meta: {
          displayName: 'Wallet',
          created: '2023-01-01',
          genesisID: 'some-genesis-id',
          remoteApi: 'http://localhost:1234',
          type: 'type1',
        },
      };
      expect(isApiMissing(walletWithApi as any)).toBe(false);
    });

    it('should return true when remoteApi is missing', () => {
      const walletWithoutApi = {
        meta: {
          displayName: 'Wallet',
          created: '2023-01-01',
          genesisID: 'some-genesis-id',
          remoteApi: '',
          type: 'type1',
        },
      };
      expect(isApiMissing(walletWithoutApi as any)).toBe(true);
    });
  });
});
