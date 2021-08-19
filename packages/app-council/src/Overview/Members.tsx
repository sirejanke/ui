/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2021 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React from 'react';
import { Table } from '@polkadot/react-components';

import translate from '../translate';
import Candidate from './Candidate';
import {Vec} from "@cennznet/types";

interface Props extends I18nProps, ComponentProps {
  className?: string;
  councilProposalMap?: Record<string, any>
}
function Members ({ className, electionsInfo, councilProposalMap,  t }: Props): React.ReactElement<Props> {
  const members = electionsInfo ? electionsInfo : [];

  return (
    <div className={className}>
      {members.length
        ? (
          <Table>
            <Table.Body>
              {(members as Vec<AccountId>).map((accountId: AccountId): React.ReactNode => (
                <Candidate
                  address={accountId}
                  key={accountId.toString()}
                  councilProposalMap={councilProposalMap ? councilProposalMap[accountId.toString()] : undefined}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No members found')
      }
    </div>
  );
}

export default translate(Members);
