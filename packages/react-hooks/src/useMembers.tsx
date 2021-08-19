// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

import { useMemo } from 'react';

interface Result {
  isMember: boolean;
  members: string[];
}

const transformMembers = {
  transform: (accounts: AccountId[]) =>
    accounts.map((accountId) => accountId.toString())
};

export function useMembers (collective: 'governance' | 'technicalCommittee' = 'governance'): Result {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const retrieved = useCall<string[]>(hasAccounts && api.query[collective]?.council, undefined, transformMembers);

  return useMemo(
    () => ({
      isMember: (retrieved || []).some((accountId) => allAccounts.includes(accountId)),
      members: (retrieved || [])
    }),
    [allAccounts, retrieved]
  );
}

// export default function useMembers (collective: 'council' | 'technicalCommittee'): Result {
//   const { api } = useApi();
//   const { allAccounts } = useAccounts();
//   const { isMember, members } = (
//     collective === 'council'
//       ? useCall<Result>(api.query.electionsPhragmen?.members || api.query.elections.members, [], {
//         transform: (accounts: [AccountId, Balance][]): Result =>
//           getResult(allAccounts, accounts.map(([accountId]) => accountId.toString()))
//       })
//       : useCall<Result>(api.query.technicalCommittee.members, [], {
//         transform: (accounts: AccountId[]): Result =>
//           getResult(allAccounts, accounts.map(accountId => accountId.toString()))
//       })
//   ) || { isMember: false, members: [] };
//
//   return { isMember, members };
// }
