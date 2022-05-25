import * as React from 'react';
import './App.css';
import { SharedMap, ContainerSchema, ISharedMap } from "fluid-framework";
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom';

const names: string[] = [
  'Yoda',
  'Jack Sparrow',
  'Captain Kirk',
  'Spock',
  'Optimus Prime',
  'Gandalf',
  'Inigo Montoya',
  'Magneto',
  'Tony Stark',
  'Bilbo Baggins',
  'Legolas',
  'Inspector Clouseau',
  'Obi Wan'
];

function temp() {
  var id: string = "";
  const getRandomName = () => {
    return names[Math.floor(Math.random() * names.length)];
  }

  const client = new TinyliciousClient();
  const containerSchema: ContainerSchema = {
    initialObjects: { myMap: SharedMap }
  };
  const timeKey = "time-key";
  const user: string = "user-1";

  const createFilePath = (id: string) => {
    return `Container/${id}`;
  };

  var filepath = "";
  const history = useHistory();
  const getMyMap = async () => {
    let container;
    // console.log("hello -> " + typeof(window.location.hash));
    if (window.location.hash.toString() === "") {
      ({ container } = await client.createContainer(containerSchema));
      const map = container.initialObjects.myMap as ISharedMap;
      map.set(timeKey, Date.now().toString());
      map.set(user, getRandomName());
      id = await container.attach();
      console.log("id -> ", id)
      filepath = createFilePath(id);
      console.log("filepath -> ", filepath);
    } else {
      id = window.location.hash.substring(1);
      ({ container } = await client.getContainer(id, containerSchema));
    }
    console.log("Helloo -> filepath", filepath);
    console.log(history)
    // history?.push(filepath);
    return container.initialObjects.myMap;
  }

  const [fluidMap, setFluidMap] = React.useState<SharedMap | undefined>();
  React.useEffect(() => {
    getMyMap().then((myMap: any) => setFluidMap(myMap));
    console.log("Hello")
    // console.log(fluidMap)
  }, []);

  const [viewData, setViewData] = React.useState({ time: 33, user: "user0" });

  React.useEffect(() => {
    if (fluidMap !== undefined) {
      const syncView = () => setViewData({
        time: (fluidMap).get(timeKey) as number,
        user: (fluidMap).get(user) as string
      });
      syncView();
      fluidMap.on("valueChanged", syncView);
      return () => { fluidMap.off("valueChanged", syncView) }
    }
  }, [fluidMap])

  if (!viewData) return <div />;

  const setTime = () => {
    // const map = fluidMap as ISharedMap;
    fluidMap?.set(timeKey, Date?.now().toString());
    console.log(Date?.now());
  };

  return (
    <>
      <nav>
        <ul style={{ display: "flex", justifyContent: "space-evenly", textDecoration: "none" }}>
          <li style={{ background: "red" }}>
            <Link to={`Container/${id}`}>Home</Link>
          </li>
          <li style={{ background: "green" }}>
            <Link to={`Container/Page1/${id}`} >Page 1</Link>
          </li>
          <li style={{ background: "yellow" }}>
            <Link to={`Container/Page2/${id}`} >Page 2</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route exact path="/">
          <h1>Hello</h1>
        </Route>
        <Route exact path={`/Container/Page1/:id`}>
          {console.log(id)}
          <h1 style={{ background: "pink" }}>Page 1</h1>
        </Route>
        <Route path={`/Container/Page2/:id`}>
          <h1>Page 2</h1>
        </Route>
        <Route exact path={`/Container/:id`}>
          <button onClick={setTime} style={{ background: "orange" }}> click </button>
          <div>{viewData.time}</div>
          <div>{viewData.user}</div>
        </Route>
      </Switch>   
    </>
  )
}

export default temp;