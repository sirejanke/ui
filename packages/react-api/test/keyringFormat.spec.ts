import { Api as ApiPromise } from '@cennznet/api';
import { BrowserStore } from '@polkadot/ui-keyring/stores';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { supportOldKeyringInLocalStorage } from "@polkadot/react-api/Api";
import { u8aToHex } from '@polkadot/util';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPair$Json2, KeyringPair$JsonEncoding2 } from "@polkadot/react-api/types";
import { updateToV3KeyringFormat } from "@polkadot/react-api/util/keyringFormat";

describe.skip('Test different keyring format with support to old key format', () => {
    let api: ApiPromise;
    let store: BrowserStore;

    beforeAll(async () => {
        api = await ApiPromise.create({
            provider: 'ws://localhost:9944',
        });
        store = new BrowserStore();
    });

    it('v2 and v3 keyring loads from local storage:', async done => {
        const keyForOldFormat = 'account:0xdcffd5cb838e225a1c00780700a253bd05ca464643d0fa3a0b0ea25c1b088a1b';
        const valueForOldFormat = {
            "address": "5H4UPcayhPuih5yA1mUyzo6C5s6yPSSnrfrnzifngXeLaMAL",
            "encoded": "0x1d0978379e161727e93caeacaf11f335f3d17e1cf03073db49fa2940b28deb99853c048e3fe29ab8dc4439e4efe845bfed68fd4a48bb726dc8f89aa9e5f9edf5b4c8aa14050337ee624189de9066f926d6e73af39a3810581dbd6ca7b6d56096f37a617f7afc21860daa292fb540b62740500eba1dca16bf0c2c6351e23dd872e29a22ecc8f7c5006445338ff1f4cb6576b949443818dd4ec5ae6259b5",
            "encoding": {"content": ["pkcs8", {"type": "sr25519"}], "type": "xsalsa20-poly1305", "version": "2"},
            "meta": {
                "name": "yolo",
                "tags": [],
                "whenCreated": 1602026199558
            }
        };

        store.set(keyForOldFormat, valueForOldFormat);
        const keyForNewFormat = 'account:0xf82e7abaa5a20645a698a08a503a0cc26d8f8ffa38e93f0771405d0a4831f26e';
        const valueForNewFormat = {
            "address": "5Hg7YGG9qRe8Nt8tbNTPMoiNJwrsEXEkRuQouxicrRtQzRVb",
            "encoded": "0x9e8f511e06ad9007467d250af28fa1dd75bf7df6fea77d81545af7b2bcb65f91a1cf134e7e33f1cc7d371ffc8bd243ad3dee807651ee19725384a7a5eaabc1ef95f656d15ba40f3ac96a3243a3757e866af7226737052c06022e9537b571e4dcaed47651980f391423d4572d7c9838ca6089d28ae40c79ae575ab4153a51575727dc93f62a036aa2a67edf62c3f73d50a9f036255ed45963a4813ba7d9",
            "encoding": {"content": ["pkcs8", "sr25519"], "type": "xsalsa20-poly1305", "version": "2"},
            "meta": {
                "name": "test",
                "tags": [],
                "whenCreated": 1607896456902
            }
        };
        store.set(keyForNewFormat, valueForNewFormat);
        const keyV3Format = 'account:0x6c1883852ad677486a68bfb0480e75ba9f8a7053a22605ad957f946daecd3f4b';
        const valueV3Format = {
            "address": "5EWSJyq6xh1yTEmpyC3g72vM57jwN5JgSWxYNSeGGdbNxPhV",
            "encoded": "RP642fYxGERWmLeOKVJzBlOMZa46mvdyNtODp4utSwIAgAAAAQAAAAgAAAAP09919cuhhU1SKfwX0pAfXjNI0NWsxc6DK5oqL3yHPW6FBvFNzFDRrjKCKxHMlV3pzW0TYrh7koJO44TLyIFlPN8PSQzLo7JHBQv8QVlKoPU8sUDN9lUhURiHnkNK0rJ5IWY161LmuZvYBUJV2gR3He2+47PG/2zduXNh2PhvpEQ65w0IftJ7MJb9ZUaAo35UoCyWhEQvfzHOWpD3",
            "encoding": {"content": ["pkcs8", "sr25519"], "type": ["scrypt", "xsalsa20-poly1305"], "version": "3"},
            "meta": {"name": "test_v3_account", "tags": [], "whenCreated": 1608000225604, "whenEdited": 1608000232843}
        }
        store.set(keyV3Format, valueV3Format);
        supportOldKeyringInLocalStorage();
        // finally load the keyring
        expect(() => keyring.loadAll({
            genesisHash: api.genesisHash,
            isDevelopment: true,
            ss58Format: 42,
            type: 'ed25519'
        }, [])).not.toThrow();
        const allAccounts = keyring.getAccounts();
        const hasYoloAccount = (account: KeyringAddress) => account.address === '5H4UPcayhPuih5yA1mUyzo6C5s6yPSSnrfrnzifngXeLaMAL' && account.meta.name === 'yolo';
        const hasTestAccount = (account: KeyringAddress) => account.address === '5Hg7YGG9qRe8Nt8tbNTPMoiNJwrsEXEkRuQouxicrRtQzRVb' && account.meta.name === 'test';
        const hasV3Account = (account: KeyringAddress) => account.address === '5EWSJyq6xh1yTEmpyC3g72vM57jwN5JgSWxYNSeGGdbNxPhV' && account.meta.name === 'test_v3_account';
        expect(allAccounts.some(hasV3Account)).toBe(true);
        expect(allAccounts.some(hasYoloAccount)).toBe(true);
        expect(allAccounts.some(hasTestAccount)).toBe(true);
        const accountYolo: KeyringAddress = keyring.getAccount('5H4UPcayhPuih5yA1mUyzo6C5s6yPSSnrfrnzifngXeLaMAL') as KeyringAddress;
        expect(u8aToHex(accountYolo.publicKey)).toEqual('0xdcffd5cb838e225a1c00780700a253bd05ca464643d0fa3a0b0ea25c1b088a1b');
        const accountTest: KeyringAddress = keyring.getAccount('5Hg7YGG9qRe8Nt8tbNTPMoiNJwrsEXEkRuQouxicrRtQzRVb') as KeyringAddress;
        expect(u8aToHex(accountTest.publicKey)).toEqual('0xf82e7abaa5a20645a698a08a503a0cc26d8f8ffa38e93f0771405d0a4831f26e');
        const accountV3Test: KeyringAddress = keyring.getAccount('5EWSJyq6xh1yTEmpyC3g72vM57jwN5JgSWxYNSeGGdbNxPhV') as KeyringAddress;
        expect(u8aToHex(accountV3Test.publicKey)).toEqual('0x6c1883852ad677486a68bfb0480e75ba9f8a7053a22605ad957f946daecd3f4b');
        done();
    });

    it('v2 keyring loads from local storage will fail without applying supportOldKeyringInLocalStorage function', async done => {
        const key = 'account:0xaa095fcd37058d98a052211ff66ab8adcf1f13a73550907273ce4bd7d697de58';
        const value = {
            "address": "5FuenKsBAocZ2xCvgvqNJ2pMwDuSRVsyduBxEnVbTwXHDBPX",
            "encoded": "0xeb82436a530edc8fb2066e9252c09d0b3b704f18e8defa314c53014e3a957b89f9af87ed8e412f52c72a6cf1d495c6d6756243c3b55372b1ba55e6ed67389bffef1233ab48e2b9a2fb94867de6dca00b6862189e2aa756b278e971db99ffa5164047712f53fd84e9ba03c881ab20c51ad68c93bb864bda506e9f326eb5ba1c7b8cc59c10d4c9eb604a991f453d316da27ba1e0b0b60cff7e79893263a3",
            "encoding": {"content": ["pkcs8", {"type": "sr25519"}], "type": "xsalsa20-poly1305", "version": "2"},
            "meta": {"name": "test_keyring_at_2.3", "tags": [], "whenCreated": 1607898333408}
        }
        store.set(key, value);
        expect(() => keyring.loadAll({
            genesisHash: api.genesisHash,
            isDevelopment: true,
            ss58Format: 42,
            type: 'ed25519'
        }, [])).toThrow();

        done();
    });

    it('import keyring v2 and v3 formats', async done => {
        const jsonWithV2 = {
            "address": "5FuenKsBAocZ2xCvgvqNJ2pMwDuSRVsyduBxEnVbTwXHDBPX",
            "encoded": "0xeb82436a530edc8fb2066e9252c09d0b3b704f18e8defa314c53014e3a957b89f9af87ed8e412f52c72a6cf1d495c6d6756243c3b55372b1ba55e6ed67389bffef1233ab48e2b9a2fb94867de6dca00b6862189e2aa756b278e971db99ffa5164047712f53fd84e9ba03c881ab20c51ad68c93bb864bda506e9f326eb5ba1c7b8cc59c10d4c9eb604a991f453d316da27ba1e0b0b60cff7e79893263a3",
            "encoding": {"content": ["pkcs8", {"type": "sr25519"}], "type": "xsalsa20-poly1305", "version": "2"} as KeyringPair$JsonEncoding2,
            "meta": {"name": "test_keyring_at_2.3", "tags": [], "whenCreated": 1607898333408}
        };
        updateToV3KeyringFormat(jsonWithV2 as KeyringPair$Json2);
        const pairV2 = keyring.keyring.createFromJson(jsonWithV2 as unknown as KeyringPair$Json);
        const password = 'test';
        const { pair } = keyring.addPair(pairV2, password);
        const pairFromRestore = keyring.restoreAccount(jsonWithV2 as unknown as KeyringPair$Json, password);
        expect(pair.address).toEqual(pairFromRestore.address);
        expect(pair.meta).toEqual(pairFromRestore.meta);
        expect(pair.publicKey).toEqual(pairFromRestore.publicKey);
        const jsonWithV3 = {
            "address": "5EWSJyq6xh1yTEmpyC3g72vM57jwN5JgSWxYNSeGGdbNxPhV",
            "encoded": "RP642fYxGERWmLeOKVJzBlOMZa46mvdyNtODp4utSwIAgAAAAQAAAAgAAAAP09919cuhhU1SKfwX0pAfXjNI0NWsxc6DK5oqL3yHPW6FBvFNzFDRrjKCKxHMlV3pzW0TYrh7koJO44TLyIFlPN8PSQzLo7JHBQv8QVlKoPU8sUDN9lUhURiHnkNK0rJ5IWY161LmuZvYBUJV2gR3He2+47PG/2zduXNh2PhvpEQ65w0IftJ7MJb9ZUaAo35UoCyWhEQvfzHOWpD3",
            "encoding": {"content": ["pkcs8", "sr25519"], "type": ["scrypt", "xsalsa20-poly1305"], "version": "3"},
            "meta": {"name": "test_v3_account", "tags": [], "whenCreated": 1608000225604, "whenEdited": 1608000232843}
        }
        const pairV3 = keyring.keyring.createFromJson(jsonWithV3 as unknown as KeyringPair$Json);
        const pairAtV3 = keyring.addPair(pairV3, password);
        const pairV3FromRestore = keyring.restoreAccount(jsonWithV3 as unknown as KeyringPair$Json, password);
        expect(pairAtV3.pair.address).toEqual(pairV3FromRestore.address);
        expect(pairAtV3.pair.meta).toEqual(pairV3FromRestore.meta);
        expect(pairAtV3.pair.publicKey).toEqual(pairV3FromRestore.publicKey);
        done();
    });
});

