// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest');
const findPackages = require('./scripts/findPackages');

const internalModules = findPackages().reduce((modules, { dir, name }) => {
  modules[`${name}(.*)$`] = `<rootDir>/packages/${dir}/src/$1`;

  return modules;
}, {});


module.exports = {
  ...config,
  moduleNameMapper: {
    // ...(
    //   findPackages()
    //     .filter(({ name }) => !['@polkadot/apps'].includes(name))
    //     .reduce((modules, { dir, name }) => {
    //       modules[`${name}(.*)$`] = `<rootDir>/packages/${dir}/src/$1`;
    //
    //       return modules;
    //     }, {})
    // ),
    ...internalModules,
    '@polkadot/apps/(.*)$': '<rootDir>/packages/apps/src/$1',
    '\\.(css|less)$': 'empty/object',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'empty/object',
    '\\.(md)$': '<rootDir>/jest/mocks/empty.js'
  },
  modulePathIgnorePatterns: ['<rootDir>/packages/apps-config/build'],
  testEnvironment: 'jsdom',
  testTimeout: 90000,
  transformIgnorePatterns: ['/node_modules/(?!@polkadot|@cennznet|@ledgerhq|@babel/runtime/helpers/esm/|@substrate|smoldot)']
};
