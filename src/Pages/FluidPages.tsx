import React from 'react'
import { Link, Route, Switch, useParams } from 'react-router-dom';
import { PATH } from '../config';
import { getFluidContainer } from '../Utils/ContainerUtils';
import { ISharedMap } from "fluid-framework";

interface IViewData {
  [key: string]: string;
}

const FluidPages = () => {
  let { id } = useParams<{ id: string }>();
  const [fluidMap, setFluidMap] = React.useState<ISharedMap>();
  const [myName, setMyName] = React.useState<string>("Ritik");
  const [path, setPath] = React.useState<string>("/");
  const [viewData, setViewData] = React.useState<IViewData>({ "input": "Enter Something here!" });
  const [inputValue, setInputValue] = React.useState<string>("Enter Something here.....");
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

  function handleChangeEvent(e: any) {
    console.log(e.target.value);
    if (e.target.value !== "") {
      fluidMap?.set("input", e.target.value);
      setInputValue(e.target.value);
    }
  }

  React.useEffect(() => {
    if (fluidMap !== undefined) {
      const syncView = () => {
        // var map = new Map();
        // fluidMap.forEach((value: string, key: string) => {
        //   map.set(key, value);
        // })
        // console.log(fluidMap.keys());
        // // console.log(fluidMap);
        // // console.log(map)
        // setViewData(map);
        console.log("hello.... update my viewData");
        const _viewData: IViewData = { ...viewData };
        fluidMap.forEach((value: string, key: string) => {
          _viewData[key] = value;
        });
        setViewData(_viewData);
        console.log(viewData);
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
              {`${myName}, ${path}`}
              {fluidMap?.forEach((value: any, key: string) => {
                console.log("key ->", key, " value ->", value, typeof (value));
              })}
              {console.log("------------------------------")}
              <button onClick={setTime} style={{ background: "orange" }}> click </button>
              <form>
                <input type="text" value={viewData['input']} onChange={handleChangeEvent} />
              </form>
              {
                Object.keys(viewData).map((key: string) => {
                  if (key === timeKey) {
                    return (
                      <div key={key}>
                        <div>time-set: {viewData[key]}</div>
                      </div>
                    )
                  }
                  else if(key !== "input"){
                    return (
                      <div key={key}>
                        <div>User: {key}</div>
                        <div>Path: {viewData[key]}</div>
                      </div>
                    )
                  }
                })
              }
              {/* {console.log("viewData -----> ", viewData)}
              {console.log("input ----------> ", viewData["input"])} */}
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