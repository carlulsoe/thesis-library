import {
  SharedTree,
  type ContainerSchema,
  type IFluidContainer,
} from 'fluid-framework';

import {
  AzureClient,
  type AzureContainerServices,
} from '@fluidframework/azure-client';
import { clientProps } from './clientProps';

export const attentionContainerSchema: ContainerSchema = {
  initialObjects: {
    attentionData: SharedTree,
  },
};

const client = new AzureClient(clientProps);

/**
 * This function will create a container if no container ID is passed.
 * If a container ID is provided, it will load the container.
 *
 * @returns The loaded container and container services.
 */
export const loadFluidData = async (
  containerId: string,
  containerSchema: ContainerSchema
): Promise<{
  services: AzureContainerServices;
  container: IFluidContainer;
}> => {
  let container: IFluidContainer;
  let services: AzureContainerServices;

  // Get or create the document depending if we are running through the create new flow
  if (containerId.length === 0) {
    // The client will create a new detached container using the schema
    // A detached container will enable the app to modify the container before attaching it to the client
    ({ container, services } = await client.createContainer(containerSchema));
  } else {
    // Use the unique container ID to fetch the container created earlier. It will already be connected to the
    // collaboration session.
    ({ container, services } = await client.getContainer(
      containerId,
      containerSchema
    ));
  }
  return { services, container };
};
