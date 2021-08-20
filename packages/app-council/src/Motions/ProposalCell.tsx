// Copyright 2017-2021 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';

import React from 'react';

import { CallExpander } from '@polkadot/react-components';
import {useTranslation} from "@polkadot/app-js/translate";
import { registry } from '@polkadot/react-api';
import { Option } from '@cennznet/types';
import {Holder} from "@polkadot/react-params";

interface Props {
  className?: string;
  imageHash?: Hash | string;
  proposal?: Option<any> | null;
}

function ProposalCell ({ className = '', imageHash, proposal }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  if (!proposal) {
    const textHash = imageHash?.toString();
    const hashDisplay = textHash ? `${textHash.slice(0, 8)}…${textHash.slice(-8)}`: '';
    return (
      <td className={`${className} all`}>
        {t('preimage {{hash}}', { replace: { hash: hashDisplay } })}
      </td>
    );
  }

  const proposalContent = registry.createType('Call',proposal.unwrapOrDefault());

  return (
    <td className={`${className} all`} style={{ width: "1000px"}}>
      <CallExpander
        labelHash={t<string>('proposal hash')}
        value={proposalContent}
        withHash={true}
      >
        <Holder
          className={className}
          withBorder
          withPadding
        >
          <CallExpander
            labelHash={t<string>('proposal hash')}
            value={proposalContent}
            withHash
          />
        </Holder>
      </CallExpander>
    </td>
  );
}

export default React.memo(ProposalCell);
