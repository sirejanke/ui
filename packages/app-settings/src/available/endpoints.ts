// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '../types';

const cennznet = {
  info: 'cennznet',
  text: 'CENNZnet (MainNet)',
  value: 'wss://cennznet.unfrastructure.io/public/ws'
};

const nikau = {
  info: 'nikau testnet',
  text: 'Nikau (TestNet)',
  value: 'wss://nikau.centrality.me/public/ws'
}

const rata = {
  info: 'rata testnet',
  text: 'Rata (TestNet)',
  value: 'wss://kong2.centrality.me/public/rata/ws'
}

const local = {
  info: 'local',
  text: 'Local Node (Own, 127.0.0.1:9944)',
  value: 'ws://127.0.0.1:9944/'
};

export default [
  cennznet, // default
  nikau,
  rata,
  local
].map((option): Option => ({ ...option, withI18n: true }));
