// Copyright 2017-2020 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiState } from './types';

import React, { useContext, useEffect, useState } from 'react';
import { isWeb3Injected, web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { StatusContext } from '@polkadot/react-components/Status';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import keyring from '@polkadot/ui-keyring';
import ApiSigner from '@polkadot/react-signer/ApiSigner';
import { createType } from '@polkadot/types';
import { formatBalance, isTestChain } from '@polkadot/util';
import { setSS58Format } from '@polkadot/util-crypto';
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults';
import { BrowserStore } from '@polkadot/ui-keyring/stores';
import { accountRegex } from '@polkadot/ui-keyring/defaults';
import ApiContext from './ApiContext';
import registry from './typeRegistry';
import {Api as ApiPromise} from '@cennznet/api';
import * as staking from './staking';
import { AssetId, AssetInfo, u32 } from '@cennznet/types';
import {AssetRegistry} from '@polkadot/app-generic-asset/assetsRegistry';
import { u8aToString } from '@polkadot/util';

interface Props {
  children: React.ReactNode;
  url?: string;
}

interface State extends ApiState {
  chain?: string | null;
  registeredAssets?: Array<[AssetId, AssetInfo]>;
}

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
  };
}

// const DEFAULT_DECIMALS = createType(registry, 'u32', 4);
// const DEFAULT_SS58 = createType(registry, 'u32', addressDefaults.prefix);
export const DEFAULT_DECIMALS = registry.createType('u32', 12);
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix);
const injectedPromise = web3Enable('cennznet.io');
let api: ApiPromise;

export { api };

export function supportOldKeyringInLocalStorage() {
  const store = new BrowserStore();
  store.all((key, json: any) => {
    if (accountRegex.test(key) && json.encoding) {
      // The difference between new way of storing the keyring is only in the field content
      // "encoding":{"content":["pkcs8",{"type":"sr25519"}] --- old
      // "encoding":{"content":["pkcs8","sr25519"] --- new
      // update the local storage with new way
      const pkcs8 = json.encoding.content[0];
      let accountType = json.encoding.content[1];
      if (typeof accountType === 'object' && accountType !== null) {
        accountType = Object.values(accountType)[0]
        json.encoding.content = [pkcs8, accountType];
        // update the storage only if has old format
        store.set(key, json);
      }
    }
  });
}

async function loadOnReady (api: ApiPromise): Promise<State> {
  const [properties, _systemChain, _systemName, _systemVersion, registeredAssets, injectedAccounts] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    // @ts-ignore
    api.rpc.genericAsset.registeredAssets() as Array<[AssetId, AssetInfo]>,
    web3Accounts().then((accounts): InjectedAccountExt[] =>
      accounts.map(({ address, meta }): InjectedAccountExt => ({
        address,
        meta: {
          ...meta,
          name: `${meta.name} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`
        }
      }))
    )
  ]);
  const ss58Format = (properties.ss58Format.unwrapOr(DEFAULT_SS58) as u32).toNumber();

  const systemChain = _systemChain
    ? _systemChain.toString()
    : '<unknown>';
  const isDevelopment = isTestChain(systemChain);

  console.log('api: found chain', systemChain, JSON.stringify(properties));

  // explicitly override the ss58Format as specified
  registry.setChainProperties(createType(registry, 'ChainProperties', { ...properties, ss58Format }));

  // FIXME This should be removed (however we have some hanging bits, e.g. vanity)
  setSS58Format(ss58Format);

  // first setup the UI helpers
  const tokenSymbol = 'CPAY';
  const tokenDecimals = (properties.tokenDecimals.unwrapOr(DEFAULT_DECIMALS) as u32).toNumber();
  formatBalance.setDefaults({
    decimals: tokenDecimals,
    unit: tokenSymbol
  });
  TokenUnit.setAbbr(tokenSymbol);

  // Go through local storage and support the storage with old keyring value
  supportOldKeyringInLocalStorage();

  // finally load the keyring
  keyring.loadAll({
    genesisHash: api.genesisHash,
    isDevelopment,
    ss58Format,
    type: 'ed25519'
  }, injectedAccounts);

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx;
  const isSubstrateV2 = !!Object.keys(api.consts).length;

  let assetsRegistry = new AssetRegistry(api.genesisHash.toString());
  registeredAssets?.map(([assetId, assetInfo]) => {
    console.log('registering asset', assetId.toString(), u8aToString(assetInfo.symbol), assetInfo.decimalPlaces.toNumber());
    assetsRegistry.add(assetId.toString(), u8aToString(assetInfo.symbol), assetInfo.decimalPlaces.toNumber());
  });

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    isApiReady: true,
    isDevelopment,
    isSubstrateV2,
    systemChain,
    systemName: _systemName.toString(),
    systemVersion: _systemVersion.toString(),
    registeredAssets,
  } as State;
}

export default function Api ({ children, url }: Props): React.ReactElement<Props> | null {
  const { queuePayload, queueSetTxStatus } = useContext(StatusContext);
  const [state, setState] = useState<State>({ isApiReady: false } as Partial<State> as State);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isWaitingInjected, setIsWaitingInjected] = useState(isWeb3Injected);
  const [isInitialized, setIsInitialized] = useState(false);

  // initial initialization
  useEffect((): void => {
    const signer = new ApiSigner(queuePayload, queueSetTxStatus);
    const derives = { staking };
    api = new ApiPromise({ provider: url, registry, derives, signer });

    api.on('connected', (): void => setIsApiConnected(true));
    api.on('disconnected', (): void => setIsApiConnected(false));
    api.on('ready', async (): Promise<void> => {
      try {
        setState(await loadOnReady(api));
      } catch (error) {
        console.error('Unable to load chain', error);
      }
    });

    injectedPromise
      .then((): void => setIsWaitingInjected(false))
      .catch((error: Error) => console.error(error));

    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <ApiContext.Provider value={{ ...state, api, isApiConnected, isWaitingInjected }}>
      {children}
    </ApiContext.Provider>
  );
}
