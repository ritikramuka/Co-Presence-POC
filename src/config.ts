import { SharedMap, ISharedMap, IFluidContainer, ContainerSchema } from 'fluid-framework';
import { TinyliciousClientProps } from '@fluidframework/tinylicious-client';

export const PATH: string = 'fluid';

// container schema
export const containerSchema = {
  initialObjects: {
      myMap: SharedMap,
  },
}

// Additional service configuration
export const clientProps: TinyliciousClientProps = {};

// Setup default data on initialObjects
// export const setDefaultData = (fluidContainer: IFluidContainer) => {
//   const defaultData: any[] = [
//     {
//       id: 'Ritik',
//       Name: "Ritik",
//       Page: "/",
//     }
//   ];
//   const map = fluidContainer.initialObjects.myMap as ISharedMap;
//   for (const data of defaultData) {
//     map.set(data.id, { Name: data.Name, Page: data.Page });
//   }
// };

