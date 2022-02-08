// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RuntimeVersion } from '@polkadot/types/interfaces';
import React, { useState } from 'react';
import styled from 'styled-components';
import routing from '@polkadot/apps-routing';
import { Icon, Menu, media } from '@polkadot/react-components';
import { useCall, useApi } from '@polkadot/react-hooks';
import { useTranslation } from '../translate';
import Item from './Item';
import NodeInfo from './NodeInfo';
import NetworkModal from '../modals/Network';

import SideBar from './SideBar';
import { SideBarItem, SideBarItemDivider, SideBarItemLink, SideBarParentItem } from './SideBarItem';
import SideBarCollapseButton from './SideBarCollapseButton';
import { SideBarAdvancedContainer, SideBarAdvancedSummary } from './SideBarAdvanced';
import SideBarHeader from './SideBarHeader';
import SideBarScroll from './SideBarScroll';
import SideBarToggle from './SideBarToggle';
import SideBarWrapper from './SideBarWrapper';

interface Props {
  className?: string;
  collapse: () => void;
  handleResize: () => void;
  isCollapsed: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isAdvanceOpen: boolean;
}

function SideBarContainer ({ className, collapse, handleResize, isCollapsed, isMenuOpen, toggleMenu, isAdvanceOpen }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isApiReady } = useApi();
  const runtimeVersion = useCall<RuntimeVersion | undefined>(isApiReady && api.rpc.state.subscribeRuntimeVersion, []);
  const [modals, setModals] = useState<Record<string, boolean>>(
    routing.routes.reduce((result: Record<string, boolean>, route): Record<string, boolean> => {
      if (route && route.Modal) {
        result[route.name] = false;
      }

      return result;
    }, { network: false })
  );

  const [isOpen, setIsOpen] = useState(false);
  if (!isOpen && isAdvanceOpen) {
    setIsOpen(true);
  }

  const _toggleModal = (name: string): () => void =>
    (): void => setModals({ ...modals, [name]: !modals[name] });

  return (
    <SideBarWrapper {...{ className, handleResize, isCollapsed }}>
      <SideBarCollapseButton {...{ collapse, isCollapsed }} />
      <SideBarToggle {...{ isMenuOpen, toggleMenu }} />
      {routing.routes.map((route): React.ReactNode => (
        route && route.Modal
          ? route.Modal && modals[route.name]
            ? (
              <route.Modal
                key={route.name}
                onClose={_toggleModal(route.name)}
              />
            )
            : <div key={route.name} />
          : null
      ))}
      {modals.network && (
        <NetworkModal onClose={_toggleModal('network')}/>
      )}
      <SideBar>
        <Menu
          secondary
          vertical
        >
          <SideBarScroll>
            {runtimeVersion && <SideBarHeader {...{ _toggleModal, runtimeVersion }} />}
            <SideBarParentItem>
            {routing.routes.map((route, index): React.ReactNode => (
              route && !route.isAdvanced
                ? (
                  <Item
                    isCollapsed={isCollapsed}
                    key={route.name}
                    route={route}
                    supportFontAwesomeIcon={true}
                    onClick={
                      route.Modal
                        ? _toggleModal(route.name)
                        : handleResize
                    }
                  />
                )
                : null
            ))}
            <SideBarItemDivider />
            <SideBarAdvancedContainer open={isOpen}>
              <SideBarAdvancedSummary><span>{t('Advanced')}</span></SideBarAdvancedSummary>
              {routing.routes.map((route, index): React.ReactNode => (
                route && route.isAdvanced
                  ? (
                    <Item
                      isCollapsed={isCollapsed}
                      key={route.name}
                      route={route}
                      supportFontAwesomeIcon={false}
                      onClick={
                        route.Modal
                          ? _toggleModal(route.name)
                          : handleResize
                      }
                    />
                  )
                  : null
              ))}
              <SideBarItem>
                <SideBarItemLink
                  href='https://github.com/cennznet/api.js'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <Icon name='github' />
                  <span className='text'>{t('GitHub')}</span>
                </SideBarItemLink>
              </SideBarItem>
              <SideBarItem>
                <SideBarItemLink
                  href='https://github.com/cennznet/cennznet/wiki'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <Icon name='book' />
                  <span className='text'>{t('Wiki')}</span>
                </SideBarItemLink>
              </SideBarItem>
              <SideBarItem>
              <SideBarItemLink
                href='https://bridge.cennz.net/'
                rel='noopener noreferrer'
                target='_blank'
              >
                <Icon name='exchange' />
                <span className='text'>{t('Ethereum Bridge')}</span>
              </SideBarItemLink>
            </SideBarItem>
            </SideBarAdvancedContainer>
            <SideBarItem>
              <SideBarItemLink
                  href='https://discord.gg/AnB3tRtkJ4'
                  rel='noopener noreferrer'
                  target='_blank'
              >
                <Icon name="question circle outline"/>
                <span className='text'>{t('Support')}</span>
              </SideBarItemLink>
            </SideBarItem>
            </SideBarParentItem>
            {
              isCollapsed
                ? undefined
                : <NodeInfo />
            }
          </SideBarScroll>
        </Menu>
      </SideBar>
    </SideBarWrapper>
  );
}

export default styled(SideBarContainer)`
  /* display: flex;
  position: relative;
  transition: width 0.3s linear;
  z-index: 300;

  .apps--SideBar {
    align-items: center;
    background: #4f4f4f;
    display: flex;
    flex-flow: column;
    height: auto;
    position: relative;
    transition: left 0.3s linear;
    width: 100%;

    .ui.vertical.menu {
      display: flex;
      height: 100vh;
      margin: 0;
      top: 0;
      width: 100%;
      position: sticky;
    }

    .apps--SideBar-Scroll {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow-y: auto;
      width: 100%;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
        width: 0px;
      }
    }

    .apps--SideBar-Item {
      align-self: flex-end;
      flex-grow: 0;
      padding: 0 !important;
      width: inherit;

      .text {
        padding-left: 0.5rem;
      }
    }

    .apps--SideBar-logo {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0.5rem 1rem 1.5rem 0;
      padding-top: 0.75em;
      width: 10rem;

      img {
        height: 2.75rem;
        width: 2.75rem;
      }

      > div.info {
        color: white;
        opacity: 0.75;
        text-align: right;
        vertical-align: middle;

        > div.chain {
          font-size: 0.9rem;
          line-height: 1rem;
        }

        > div.runtimeVersion {
          font-size: 0.75rem;
          line-height: 1rem;
        }
      }
    }

    .apps--SideBar-collapse {
      background: #4f4f4f;
      bottom: 0;
      left: 0;
      padding: 0.75rem 0 .75rem 0.65rem;
      position: sticky;
      right: 0;
      text-align: left;
      width: 100%;

      .ui.circular.button {
        background: white !important;
        color: #3f3f3f !important;
        margin: 0;
        transition: transform 0.15s;
      }
    }

    .apps--SideBar-toggle {
      height: 100%;
      position: absolute;
      right: 0px;
      top: 0px;
      transition: all 0.2s;
      width: 6px;

      &:hover {
        background: rgba(255,255,255,0.15);
        cursor: pointer;
      }
    }
  }

  .toggleImg {
    cursor: pointer;
    height: 2.75rem;
    left: 0.9rem;
    opacity: 0;
    position: absolute;
    top: 0px;
    transition: opacity 0.2s ease-in, top 0.2s ease-in;
    width: 2.75rem;

    &.delayed {
      transition-delay: 0.4s;
    }

    &.open {
      opacity: 1;
      top: 0.9rem;
    }

    ${media.DESKTOP`
      opacity: 0 !important;
      top: -2.9rem !important;
    `}
  } */
`;
