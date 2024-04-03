/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import {
  type AzureClientProps,
  type AzureLocalConnectionConfig,
} from '@fluidframework/azure-client';
import { InsecureTokenProvider } from '@fluidframework/test-runtime-utils';
import { createDevtoolsLogger } from '@fluidframework/devtools';
import { Guid } from 'guid-typescript';
import { type IInsecureUser } from '@fluidframework/test-runtime-utils';

// Instantiate the logger
export const devtoolsLogger = createDevtoolsLogger();

// Generate test user.
export const generateTestUser = (): IInsecureUser => {
  const user = {
    id: Guid.create().toString(),
    name: '[TEST USER NAME]',
  };
  return user;
};

export const user = generateTestUser();

console.warn(`Configured to use local tinylicious.`);

const localConnectionConfig: AzureLocalConnectionConfig = {
  type: 'local',
  tokenProvider: new InsecureTokenProvider('VALUE_NOT_USED', user),
  endpoint: 'http://localhost:7070',
};

const connectionConfig: AzureLocalConnectionConfig = localConnectionConfig;

export const clientProps: AzureClientProps = {
  connection: connectionConfig,
  logger: devtoolsLogger,
};
