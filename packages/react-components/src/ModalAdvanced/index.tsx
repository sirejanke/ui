// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeDef } from '@polkadot/react-components/types';
import type { ActionsProps, ColumnProps, ModalProps } from './types';

import React, { useContext } from 'react';
import { Modal as SUIModal } from 'semantic-ui-react';
import { ThemeContext } from 'styled-components';

import Actions from './Actions';
import Column from './Column';
import Columns from './Columns';

type ModalType = React.FC<ModalProps> & {
  Actions: React.FC<ActionsProps>;
  Column: React.FC<ColumnProps>;
  Columns: React.FC<ColumnProps>;
  Content: typeof SUIModal.Content;
  Header: typeof SUIModal.Header;
  Description: typeof SUIModal.Description;
};

function ModalBase (props: ModalProps): React.ReactElement<ModalProps> {
  const { theme } = useContext<ThemeDef>(ThemeContext);
  const { children, className = '', header, open = true } = props;

  return (
    <SUIModal
      {...props}
      className={`theme--${theme} ui--Modal ${className}`}
      header={undefined}
      open={open}
    >
      {header && (
        <SUIModal.Header>{header}</SUIModal.Header>
      )}
      {children}
    </SUIModal>
  );
}

const ModalAdvanced = React.memo(ModalBase) as unknown as ModalType;

ModalAdvanced.Actions = Actions;
ModalAdvanced.Column = Column;
ModalAdvanced.Columns = Columns;
ModalAdvanced.Content = SUIModal.Content;
ModalAdvanced.Header = SUIModal.Header;
ModalAdvanced.Description = SUIModal.Description;

export default ModalAdvanced;
