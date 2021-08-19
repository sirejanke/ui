// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { DeriveCouncilProposals } from '@polkadot/api-derive/types';
import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Tabs } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Overview from './Overview';
import Motions from './Motions';
import translate from "@polkadot/react-components/translate";
import {useTranslation} from "@polkadot/app-sudo/translate";
import {DeriveProposalInfo} from "@cennznet/api/derives/governance/types";

export { default as useCounter } from './useCounter';

interface Props extends AppProps, BareProps, I18nProps {}

function App ({ basePath, className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { pathname } = useLocation();

  const motions = useCall<DeriveProposalInfo[]>((api.derive as any).governance.proposals);

  const councilProposalMap = motions?.reduce((acc: Record<string, any>, motion)=> {
    const sponsor = motion.proposal.sponsor;

    if (acc[sponsor.toString()]) {
      acc[sponsor.toString()].proposals.push(motion.proposal);
      acc[sponsor.toString()].proposalId.push(motion.id);
    } else {
      acc[sponsor.toString()] = {
        proposals: [motion.proposal],
        proposalId: [motion.id]
      };
    }
    return acc;
  }, {});

  const { t } = useTranslation();

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('Council overview')
            },
            {
              name: 'motions',
              text: t('Motions ({{count}})', { replace: { count: motions?.length || 0 } })
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/motions`}>
          <Motions motions={motions}/>
        </Route>
      </Switch>
      <Overview councilProposalMap={councilProposalMap} className={[basePath, `${basePath}/candidates`].includes(pathname) ? '' : 'council--hidden'} />
    </main>
  );
}

export default translate(styled(App)`
.council--hidden {
      display: none;
    }
`
);
