// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { Call } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import { withCalls, withMulti, registry } from '@polkadot/react-api';

import { Button, Extrinsic, Input } from '@polkadot/react-components';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';
import { createType } from '@polkadot/types';
import translate from '../translate';
import { SubmittableExtrinsic } from '@cennznet/api/types';

interface Props extends TxModalProps, ApiProps {
  memberCount: number;
}

interface State extends TxModalState {
  method: Call | null | SubmittableExtrinsic<'promise'>;
  enactmentDelay: number | null;
  justificationCid: string | null;
}

class Propose extends TxModal<Props, State> {
  constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      method: null,
      enactmentDelay: null,
      justificationCid: null
    };
    this.state = this.defaultState;
  }

  public static getDerivedStateFromProps ({ memberCount }: Props, { enactmentDelay }: State): Pick<State, never> | null {
    if (!enactmentDelay && memberCount > 0) {
      const simpleMajority = new BN((memberCount / 2) + 1);

      return { threshold: simpleMajority };
    }

    return null;
  }

  protected headerText = (): string => this.props.t('Propose a council motion');

  protected txMethod = (): string => 'governance.submitProposal';

  protected txParams = () => {
    const { method, enactmentDelay, justificationCid } = this.state;
    if (method) {
      const mtdHex = createType(registry, 'Call', method).toHex();
      return [
        registry.createType('Vec<u8>', mtdHex),
        registry.createType('Vec<u8>', justificationCid),
        registry.createType('u64', enactmentDelay)
      ];
    }
    return [];
  }

  protected isDisabled = (): boolean => {
    const { accountId, method, enactmentDelay, justificationCid } = this.state;

    const hasMethod = !!method;
    return !accountId || !hasMethod || !justificationCid || !enactmentDelay;
  }

  protected renderTrigger = (): React.ReactNode => {
    const { t } = this.props;

    return (
      <Button.Group>
        <Button
          isPrimary
          label={t('Propose a council motion')}
          icon='add'
          onClick={this.showModal}
        />
      </Button.Group>
    );
  }

  protected renderContent = (): React.ReactNode => {
    const { apiDefaultTxSudo, t } = this.props;
    const { enactmentDelay, justificationCid } = this.state;
    return (
      <>
        <Input
          autoFocus
          help={t('A link to the justification behind this proposal')}
          label={t('Justification URI')}
          onChange={this.onChangeJustificationCid}
          value={justificationCid}
        />
        <Input
          type={"number"}
          className='medium'
          label={t('Enactment Delay')}
          help={t('Delay the affect of this proposal e.g. to allow ecosystem updates')}
          isError={!enactmentDelay || enactmentDelay<=0}
          onChange={this.onChangeEnactmentDelay}
          placeholder={
            t(
              'Positive number'
            )
          }
          value={enactmentDelay || 0}
        />
        <Extrinsic
          defaultValue={apiDefaultTxSudo}
          label={t('proposal')}
          onChange={this.onChangeExtrinsic}
          onEnter={this.sendTx}
        />
      </>
    );
  }

  private onChangeJustificationCid = (justificationCid: string | null = null): void => {
    this.setState({ justificationCid });
  }
  private onChangeEnactmentDelay = (enactmentDelay: any): void => {
    this.setState({ enactmentDelay: enactmentDelay });
  }

  private onChangeExtrinsic = (method?: Call | SubmittableExtrinsic<'promise'>): void => {
    if (!method) {
      return;
    }

    this.setState({ method });
  }
}

export default withMulti(
  Propose,
  translate,
  withCalls(
    ['query.governance.council', {
      fallbacks: ['query.elections.members'],
      propName: 'memberCount',
      transform: (value: any[]): number =>
        value.length
    }]
  )
);
