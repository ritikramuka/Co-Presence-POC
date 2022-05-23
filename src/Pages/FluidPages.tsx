import React from 'react'
import { Link, Route, Switch, useParams } from 'react-router-dom';
import { PATH } from '../config';
import { getFluidContainer } from '../Utils/ContainerUtils';
import { ISharedMap } from "fluid-framework";

const FluidPages = () => {
  let { id } = useParams<{ id: string }>();
  const [fluidMap, setFluidMap] = React.useState<ISharedMap>();
  const [myName, setMyName] = React.useState<string>("Ritik");
  const [path, setPath] = React.useState<string>("/");
  const [viewData, setViewData] = React.useState<any>([{ "DummyName": "/" }]);
  const timeKey = "time-key";

  React.useEffect(() => {
    const promptValue = window.prompt('Enter your name');
    var myName: string = 'Guest' + Math.floor(Math.random() * 100);
    if (promptValue !== null) {
      myName = (promptValue);
    }
    const loadMap = async () => {
      const { container } = await getFluidContainer(id);
      return container.initialObjects.myMap as ISharedMap;
    }
    loadMap().then(map => {
      // map.set(timeKey, Date.now().toString());
      if (window.location.pathname.split('/')[3] === undefined) {
        map.set(myName, path);
      } else {
        map.set(myName, window.location.pathname.split('/')[3]);
        setPath(window.location.pathname.split('/')[3]);
      }
      setFluidMap(map);
    });

    setMyName(myName);
  }, [id])

  const setMapPath = (currPath: string) => {
    if (fluidMap && fluidMap.get(myName)) {
      fluidMap?.set(myName, currPath);
    }
  }

  const setTime = () => {
    // const map = fluidMap as ISharedMap;
    fluidMap?.set(timeKey, Date?.now().toString());
  };

  React.useEffect(() => {
    if (fluidMap !== undefined) {
      const syncView = () => {
        var map = new Map();
        fluidMap.forEach((value: string, key: string) => {
          map.set(key, value);
        })
        // console.log(fluidMap);
        // console.log(map)
        setViewData(map);
      };
      syncView();
      fluidMap.on("valueChanged", syncView);
      return () => { fluidMap.off("valueChanged", syncView) }
    }
  }, [fluidMap])

  // const printMap = () => {
  //   return (
  //     <>
  //       {fluidMap?.forEach((value: string, key: string) => {
  //         return (
  //           <div key={key}>
  //             <div>Name: {key}</div>
  //             <div>Path: {value}</div>
  //           </div>
  //         )
  //       })}
  //     </>
  //   );
  // }

  return (
    <div>
      <Route>
        <nav>
          <ul>
            <li>
              <Link to={`/${PATH}/${id}/page1`} onClick={() => { setPath('/page1'); setMapPath('/page1') }} >Page 1</Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to={`/${PATH}/${id}/page2`} onClick={() => { setPath('/page1'); setMapPath('/page2') }}>Page 2</Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to={`/${PATH}/${id}`} onClick={() => { setPath('/page1'); setMapPath('/') }}>Back</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path={`/${PATH}/${id}/page1`}>
            <h1>
              Hello from page 1
              <button onClick={setTime} style={{ background: "orange" }}> click </button>
              {`${myName}, ${path}`}
              {fluidMap?.forEach((value: any, key: string) => {
                console.log("key ->", key, " value ->", value, typeof (value));
              })}
              {console.log("------------------------------")}
            </h1>
          </Route>
          <Route exact path={`/${PATH}/${id}/page2`}>
            <h1>
              Hello From Page 2
              {`${myName}, ${path}`}
            </h1>
          </Route>
          <Route exact path={`/${PATH}/${id}`}>
            <h1>
              Hello, {`${myName}, ${path}`}
              {/* {printMap()} */}
            </h1>
          </Route>
        </Switch>
      </Route>
    </div >
  )
}

export default FluidPages

// map.forEach(return <div>key</div>)