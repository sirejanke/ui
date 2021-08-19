// Copyright 2017-2019 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Table } from '@polkadot/react-components';

import Motion from './Motion';
import Propose from './Propose';
import translate from '../translate';
import { useMembers } from '@polkadot/react-hooks';

interface Props extends I18nProps {
  motions?: any;
}

function Proposals ({ className, motions, t }: Props): React.ReactElement<Props> {
  const { isMember, members } = useMembers();

  return (
    <div className={className}>
      <Propose />
      {motions?.length
        ? (
          <Table>
            <Table.Body>
              {motions?.map((motion: any): React.ReactNode => (
                <Motion
                  isMember={isMember}
                  key={motion.id}
                  members={members}
                  motion={motion}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No council motions')
      }
    </div>
  );
}

export default translate(Proposals);
