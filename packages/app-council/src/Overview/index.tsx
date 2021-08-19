// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useApi, useCall } from '@polkadot/react-hooks';

import Members from './Members';
import { Vec } from '@cennznet/types';

interface Props {
  className?: string;
  councilProposalMap?: Record<string, any>
}

export default function Overview ({ councilProposalMap, className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const _electionsInfo = useCall<Vec<AccountId>>(api.query.governance.council, []);

  const { pathname } = useLocation();
  const electionsInfo = _electionsInfo;

  return (
    <div className={className}>
      <Members
        className={pathname === '/council' ? '' : 'council--hidden'}
        electionsInfo={electionsInfo}
        councilProposalMap={councilProposalMap}
      />
    </div>
  );
}
