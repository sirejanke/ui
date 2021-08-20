import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {Api as ApiPromise} from '@cennznet/api';

describe('e2e transactions', () => {
  let api: ApiPromise;
  let alice: any, bob: any;

  beforeAll(async () => {
    await cryptoWaitReady();

    api = await ApiPromise.create({
      provider: 'ws://localhost:9944',
    });
    const keyring = new Keyring({ type: 'sr25519' });
    alice = keyring.addFromUri('//Alice');
    bob = keyring.addFromUri('//Bob');
  });

  afterAll(() => {
    api.disconnect();
  });

  describe('Balance', () => {
    it('Check the transferred balance:', async done => {
      const CENNZ = 16000;
      const assetBalance = await api.query.genericAsset.freeBalance(CENNZ, alice.address);
      console.log("Alice's Balance for CENNZ", assetBalance.toString());

      const bobAssetBalance = await api.query.genericAsset.freeBalance(CENNZ, bob.address);
      console.log("Bob's Balance for CENNZ ", bobAssetBalance.toString());
      done();
    });
  });
});
