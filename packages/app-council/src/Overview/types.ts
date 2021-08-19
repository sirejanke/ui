// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Vec, u8, u64 } from '@cennznet/types';

export interface ComponentProps {
  electionsInfo: Vec<AccountId>  | undefined;
}

export interface Proposal {
  call: Vec<u8>,
  justificationCid: Vec<u8>,
  enactmentDelay: u64
}
