// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';

import { keyring } from '@polkadot/ui-keyring';

import useIsMountedRef from './useIsMountedRef';

interface UseAccounts {
  allAccounts: string[];
  hasAccounts: boolean;
}

export default function useAccounts (): UseAccounts {
  const mounted = useIsMountedRef();
  const [state, setState] = useState<UseAccounts>({ allAccounts: [], hasAccounts: false });

  useEffect((): () => void => {
    const subscription = keyring.accounts.subject.subscribe((accounts): void => {
      if (mounted.current) {
        const allAccounts = accounts ? Object.keys(accounts) : [];
        const hasAccounts = allAccounts.length !== 0;

        setState({ allAccounts, hasAccounts });
      }
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
