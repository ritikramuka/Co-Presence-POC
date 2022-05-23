import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { ISharedMap } from 'fluid-framework';
import {
  containerSchema,
  clientProps,
  PATH,
} from '../config';

const client = new TinyliciousClient(clientProps);

export const createFilePath = (id: string) => {
  return `/${PATH}/${id}`;
};

export const createFluidFile = async () => {
  const { container } = await client.createContainer(containerSchema);
  // const map =  container.initialObjects.myMap;
  const id = await container.attach();
  return createFilePath(id);
};

export const getFluidContainer = async (id: string) => {
  return await client.getContainer(id, containerSchema);
};
