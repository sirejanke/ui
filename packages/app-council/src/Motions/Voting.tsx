// Copyright 2017-2021 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Hash, ProposalIndex } from '@polkadot/types/interfaces';
import React, { useState } from 'react';

import { Button, ModalAdvanced, MarkWarning, ProposedAction, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';
import {useTranslation} from "@polkadot/app-js/translate";
import {registry} from "@polkadot/react-api";
import {Option} from "@cennznet/types";


interface Props {
  hash: Hash;
  idNumber: ProposalIndex;
  isDisabled: boolean;
  members: string[];
  prime: AccountId | null;
  proposal: Option<any>;
}

function Voting ({ idNumber, isDisabled, members, prime, proposal }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [isVotingOpen, toggleVoting] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);

  if (!hasAccounts) {
    return null;
  }
  const isPrime = prime?.toString() === accountId;

  return (
    <>
      {isVotingOpen && (
        <ModalAdvanced
          header={t<string>('Vote on proposal')}
          size='large'
        >
          <ModalAdvanced.Content>
            <ModalAdvanced.Columns>
              <ModalAdvanced.Column>
                <ProposedAction
                  idNumber={idNumber}
                  proposal={registry.createType('Call',proposal.unwrapOrDefault())}
                />
              </ModalAdvanced.Column>
              <ModalAdvanced.Column>
                <p>{t<string>('The proposal that is being voted on. It will pass when the threshold is reached.')}</p>
              </ModalAdvanced.Column>
            </ModalAdvanced.Columns>
            <ModalAdvanced.Columns>
              <ModalAdvanced.Column>
                <VoteAccount
                  filter={members}
                  onChange={setAccountId}
                />
                {isPrime && (
                  <MarkWarning content={t<string>('You are voting with this collective\'s prime account. The vote will be the default outcome in case of any abstentions.')} />
                )}
              </ModalAdvanced.Column>
              <ModalAdvanced.Column>
                <p>{t<string>('The council account for this vote. The selection is filtered by the current members.')}</p>
              </ModalAdvanced.Column>
            </ModalAdvanced.Columns>
          </ModalAdvanced.Content>
          <ModalAdvanced.Actions onCancel={toggleVoting}>
            <TxButton
              accountId={accountId}
              icon='ban'
              isDisabled={isDisabled}
              label={t<string>('Vote Nay')}
              onStart={toggleVoting}
              params={[idNumber, false]}
              tx='governance.voteOnProposal'
            />
            <TxButton
              accountId={accountId}
              icon='check'
              isDisabled={isDisabled}
              label={t<string>('Vote Aye')}
              onStart={toggleVoting}
              params={[idNumber, true]}
              tx='governance.voteOnProposal'
              withSpinner
            />
          </ModalAdvanced.Actions>
        </ModalAdvanced>
      )}
      <Button
        icon='check'
        isDisabled={isDisabled}
        label={t<string>('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
