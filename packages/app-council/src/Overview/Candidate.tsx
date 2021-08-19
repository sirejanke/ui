// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import {AddressSmall, Table} from '@polkadot/react-components';

import translate from '../translate';
import Voters from './Voters';
import ProposalCell from "@polkadot/app-council/Motions/ProposalCell";

interface Props extends I18nProps {
  address: AccountId;
  voters?: AccountId[];
  councilProposalMap: Record<string, any>
}

function Candidate ({ address, councilProposalMap, t }: Props): React.ReactElement<Props> {

  return (
    <tr>
      <td className='top'>
        <AddressSmall value={address} />
      </td>
      <td className='all'>
      <Table>
        <Table.Body>
        {councilProposalMap && councilProposalMap.proposals.length !== 0 &&
         councilProposalMap.proposals.map((proposal: any, idx: number) =>
         <tr key={proposal.toString()+idx}>
            <td className='top together right'>
              {councilProposalMap?.proposalId && councilProposalMap.proposalId.length !== 0 && (
                <Voters proposalId={councilProposalMap.proposalId[idx]} />
              )}
            </td>
              <ProposalCell
                className='all'
                proposal={proposal.call}
              />
          </tr>
         )}
        {(councilProposalMap === undefined) && <tr className='top'><td className='all'></td></tr>}
      </Table.Body>
      </Table>
      </td>
    </tr>
  );
}

export default translate(Candidate);
