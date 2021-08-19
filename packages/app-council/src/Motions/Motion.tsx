// Copyright 2017-2019 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { DerivedCouncilProposal } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import React, {useEffect, useState} from 'react';

import { AddressMini } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import translate from '../translate';
import Voting from "@polkadot/app-council/Motions/Voting";
import ProposalCell from './ProposalCell';
import {
  faCompass
} from '@fortawesome/free-solid-svg-icons';
import {useApi, useCall} from "@polkadot/react-hooks";
import {ProposalVotes} from "@cennznet/types";
import { Api as ApiPromise } from '@cennznet/api';

interface Props extends I18nProps {
  isMember: boolean;
  members: string[];
  motion: any;
}


async function retrieveVoteInfo (api: ApiPromise): Promise<ProposalVotes[]> {
  try {
    const votesFetched = await (api.rpc as any).governance.getProposalVotes();

    return votesFetched;
  } catch (error) {
    return [];
  }
}

function Motion ({ className, members, motion: { id, proposal  }, t }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const [voteInfo, setVoteInfo] = useState<ProposalVotes[]>([]);
  const vote1 = useCall(api.query.governance.proposalVotes, [id]);

  useEffect((): void => {
    const _getVotes = (): void => {
      retrieveVoteInfo(api as ApiPromise).then(setVoteInfo);
    };

    _getVotes();

  }, [vote1]);

  const vote: [] = voteInfo.find(vote => vote.proposalId.toNumber() === id)?.votes.toJSON() as [];
  const totalVotes: any = {ayes:[], nays:[]};
  vote?.map((record: any[]) => {
    if (record[1] === true) {
      totalVotes.ayes.push(record[0]);
    }
    else if (record[1] === false) {
      totalVotes.nays.push(record[0]);
    }
  })

  const { ayes, nays } = totalVotes;

  return (
    <tr className={className}>
      <td className='number top'><h1>{formatNumber(id)}</h1></td>
      <ProposalCell
        className='top'
        proposal={proposal.call}
      />

      <td className='number top'>
        <label>{t('EnactmentDelay')}</label>
        {proposal.enactmentDelay}
      </td>

      <td className='number top'>
        <label>{t('Justification URI')}</label>
        <a target="_blank" href={proposal.justificationCid}><FontAwesomeIcon icon={faCompass} color='blue' size='2x' /> </a>
      </td>
      <td className='top'>
        {ayes.map((address: any): React.ReactNode => (
          <AddressMini
            key={`${id}:${address}`}
            label={t('Aye')}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='top'>
        {nays.map((address: any): React.ReactNode => (
          <AddressMini
            key={`${id}:${address}`}
            label={t('Nay')}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='number top together'>
        <Voting
          hash={id}
          idNumber={id}
          proposal={proposal.call}
          isDisabled={false}
          members={members}
          prime={null}
        />
      </td>
    </tr>
  );
}

export default translate(Motion);
