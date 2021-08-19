// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, {useEffect, useState} from 'react';
import { AddressMini } from '@polkadot/react-components';

import translate from '../translate';
import {useApi, useCall} from "@polkadot/react-hooks";
import {ProposalVotes} from "@cennznet/types";
import {Api as ApiPromise} from "@cennznet/api/Api";

interface Props extends I18nProps {
  proposalId: number;
}

async function retrieveVoteInfo (api: ApiPromise): Promise<ProposalVotes[]> {
  try {
    const votesFetched = await (api.rpc as any).governance.getProposalVotes();

    return votesFetched;
  } catch (error) {
    return [];
  }
}

function Voters ({ proposalId, t }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const [voteInfo, setVoteInfo] = useState<ProposalVotes[]>([]);
  const vote1 = useCall(api.query.governance.proposalVotes, [proposalId]);

  useEffect((): void => {
    const _getVotes = (): void => {
      retrieveVoteInfo(api as ApiPromise).then(setVoteInfo);
    };

    _getVotes();

  }, [vote1]);

  const vote: [] = voteInfo.find(vote => vote.proposalId.toNumber() === proposalId)?.votes.toJSON() as [];
  let voters = vote ? vote.map((record: any[]) => {
    if (record[1] === true) {
      return record[0];
    }
  }) : [];
  voters = voters?.filter(voter => voter !== undefined);
  return (
    <details>
      <summary>
        {t('🟢 Voters ({{count}})', {
          replace: {
            count: voters.length
          }
        })}
      </summary>
      {voters.map((who): React.ReactNode =>
        <AddressMini
          key={who.toString()}
          value={who}
        />
      )}
    </details>
  );
}

export default translate(Voters);
