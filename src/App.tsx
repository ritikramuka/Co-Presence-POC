import * as React from 'react';
import './App.css';
import { SharedMap, ContainerSchema, ISharedMap } from "fluid-framework";
import { TinyliciousClient } from '@fluidframework/tinylicious-client';

function App() {
  const client = new TinyliciousClient();
  const containerSchema: ContainerSchema = {
    initialObjects: { myMap: SharedMap }
  };
  const timeKey = "time-key";

  const getMyMap = async () => {
    let container;
    // console.log("hello -> " + typeof(window.location.hash));
    if (window.location.hash.toString() === "") {
      ({ container } = await client.createContainer(containerSchema));
      const map = container.initialObjects.myMap as ISharedMap;
      map.set(timeKey, Date.now().toString());
      const id = await container.attach();
      window.location.hash = id;
    } else {
      const id = window.location.hash.substring(1);
      ({ container } = await client.getContainer(id, containerSchema));
    }
    return container.initialObjects.myMap;
  }

  const [fluidMap, setFluidMap] = React.useState<SharedMap | undefined>();

  React.useEffect(() => {
    getMyMap().then((myMap: any) => setFluidMap(myMap));
    console.log("Hello")
    // console.log(fluidMap)
  }, []);

  const [viewData, setViewData] = React.useState({ time: 33 });

  React.useEffect(() => {
    if (fluidMap !== undefined) {
      const syncView = () => setViewData({ time: (fluidMap).get(timeKey) as number });
      syncView();
      fluidMap.on("valueChanged", syncView);
      return () => { fluidMap.off("valueChanged", syncView) }
    }
  }, [fluidMap])

  if (!viewData) return <div />;

  const setTime = () => {
    // const map = fluidMap as ISharedMap;
    fluidMap?.set(timeKey, Date?.now().toString())
    console.log(Date?.now());
  };

  return (
    <div>
      <button onClick={setTime}> click </button>
      <span>{viewData.time}</span>
    </div>
  )
}

export default App;
