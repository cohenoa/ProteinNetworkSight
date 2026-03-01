import { FC, useEffect, useState } from "react";
import { ICustomGraphData } from "../@types/graphs";
import { makePostRequest } from "../common/PostRequest";
import VectorsButtons from "../bars/VectorsButtons";
import LoadingComponent from "../components/Loading";
import GraphBar from "../bars/GraphBar";
import TableComponent from "../components/Table";
import { useStateMachine } from "little-state-machine";
import { updateIsLoading, updateShowError, updateThresholds } from "../common/UpdateActions";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import "../styles/Result.css";
import ErrorScreen from "../components/ErrorScreen";
import CytoscapejsComponentself from "../components/Cytoscapejs";
import { set, getMany, update } from 'idb-keyval';
import {
  INamesStringMap,
  IVectorsValues,
} from "../@types/global";
import { threshMap } from "../@types/global";
import { IStepProps } from "../@types/props";

import { MAX_NODES_PER_GRAPH, NO_STRING_ID } from "../Constants";

const Result: FC<IStepProps> = ({ step, goNextStep }) => {
  const { state, actions } = useStateMachine({
    updateIsLoading,
    updateShowError,
    updateThresholds,
  });

  const [clickedVector, setClickedVector] = useState<string>(state.vectorsHeaders[0]);
  const [graphData, setGraphData] = useState<ICustomGraphData>({
    nodes: [],
    links: [],
  });

  // const missingNodes = useRef<{orgName: string, value: number}[]>([]);
  const [missingNodes, setMissingNodes] = useState<{orgName: string, value: number}[]>([]);
  const [openTable, setOpenTable] = useState<boolean>(false);
  const [tooManyModal, setTooManyModal] = useState<{[key: string]: number}>(
    Object.fromEntries(state.headers.map(header => [header, 0]))
  );
  const [tooManyThresholds, setTooManyThresholds] = useState<threshMap>({
    pos: state.thresholds[clickedVector].pos,
    neg: state.thresholds[clickedVector].neg,
  });
  const [thresholds, setThresholds] = useState<threshMap>({
    pos: state.thresholds[clickedVector].pos,
    neg: state.thresholds[clickedVector].neg,
  });
  let vectorsValues: IVectorsValues = {} as IVectorsValues;

  useEffect(() => {
    const fetchData = async () => {
      try {
          setClickedVector(state.vectorsHeaders[0]);
          let loader = new FontLoader();
          loader.load(
            "https://threejs.org/examples/fonts/optimer_regular.typeface.json",
            (loaded_font) => {
              console.log("loaded font");
              setFont(loaded_font);
            }
          );
      } catch (err) {
        console.log('It failed!', err);
        return;
      }
    };

    fetchData();
  }, [state.fileName, state.vectorsHeaders]);

  const [font, setFont] = useState<Font | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!clickedVector) return;
    setThresholds({
      pos: state.thresholds[clickedVector].pos,
      neg:  state.thresholds[clickedVector].neg,
    });
    getGraphData(clickedVector);
  }, [clickedVector, state.thresholds]);

  useEffect(() => {
    if ( thresholds.pos !== state.thresholds[clickedVector].pos || thresholds.neg !== state.thresholds[clickedVector].neg) {
      actions.updateThresholds({ 
        thresholds: {
          ...state.thresholds,
          [clickedVector]: {
            pos: thresholds.pos,
            neg: thresholds.neg
          }
        }
      });
      
      console.log("changed thresholds");
    }
  }, [thresholds]);

  const handleError = (err: string) => {
    console.log("error in makePostRequest", err);
    setError(true);
    actions.updateIsLoading({ isLoading: false });
  };

  const isGraphMemValuesValid = (
      graphData: ICustomGraphData, 
      thresholds: threshMap, 
      missingNodes: {orgName: string, value: number}[], 
      namesStringMap: INamesStringMap) => {


    if (!graphData) return false;

    if (thresholds.pos !== state.thresholds[clickedVector].pos || thresholds.neg !== state.thresholds[clickedVector].neg) return false;
    
    for (const missingNode of missingNodes){
      if (namesStringMap[missingNode.orgName].stringId !== NO_STRING_ID) return false;
    }
    
    for (const node of graphData.nodes) {
      if (namesStringMap[node.id].stringId === NO_STRING_ID) return false;
    }
    return true;
  }

  const getGraphData = (vectorName: string) => {
    console.log("getting graph data");
    setError(false);
    console.log(clickedVector);
    actions.updateIsLoading({ isLoading: true });

    getMany([vectorName + "_graph", "namesStringMap"]).then(([val, namesStringMap]) => {
      console.log("val: ", val);
      if (val && isGraphMemValuesValid(val.graphData, val.thresholds, val.missingNodes, namesStringMap as INamesStringMap)) {
        console.log("graph data from mem: ", val.graphData);
        console.log("thresholds from mem: ", val.thresholds);
        console.log("missing nodes from mem: ", val.missingNodes);
        setGraphData(val.graphData as ICustomGraphData);
        setMissingNodes(val.missingNodes as {orgName: string, value: number}[]);
        actions.updateIsLoading({ isLoading: false });
      }
      else {
        console.log("getting graph data from server");
        getMany([vectorName + "_data", "proteinsNames"]).then(([values_arr, ids_arr]) => {
          const idsList: number[] = [];
          const stringNames: string[] = [];
          const proteins: string[] = [];
          const missing: {orgName: string, value: number}[] = [];

          let values_map: { [key: string]: number } = {};
          for (let i = 0; i < values_arr.length; i++) {
            values_map[ids_arr[i]] = values_arr[i];
          }

          console.log("namesStringMap: ", namesStringMap);
          console.log("values_map: ", values_map);

          Object.entries(namesStringMap as INamesStringMap).forEach(([orgName, { stringName, stringId }]) => {
            const val = values_map[orgName];
            if (val > state.thresholds[clickedVector].pos || val < state.thresholds[clickedVector].neg) {
              if (stringId === NO_STRING_ID){
                missing.push({orgName: orgName, value: val});
              }
              else{
                idsList.push(stringId);
                stringNames.push(stringName);
                proteins.push(orgName);
              }
            }
          });

          if (idsList.length > MAX_NODES_PER_GRAPH && tooManyModal[clickedVector] >= 0){
            console.log("too many nodes(" + idsList.length + "), " + tooManyModal[clickedVector]);
            setTooManyThresholds({...state.thresholds[clickedVector]});
            setTooManyModal({...tooManyModal, [clickedVector]: idsList.length});
            return;
          }

          setMissingNodes(missing);

          set(clickedVector + "_graph", {
            graphData: null,
            thresholds: {...state.thresholds[clickedVector]} as threshMap,
            missingNodes: missing
          });

          const body = {
            values_map: values_map,
            thresh_pos: state.thresholds[clickedVector].pos,
            thresh_neg: state.thresholds[clickedVector].neg,
            score_thresh: state.scoreThreshold,
            proteins: proteins,
            ids: idsList,
            string_names: stringNames,
          };
          console.log("body", body);

          makePostRequest(JSON.stringify(body), "graphs", handleJsonGraphData, handleError);
        });
      }
    });
  };

  const handleJsonGraphData = (jsonString: string) => {
    const tempGraphData: ICustomGraphData = JSON.parse(jsonString);
    setGraphData(tempGraphData);
    update(clickedVector + "_graph", (oldValue) => {
      return {
        ...oldValue,
        graphData: tempGraphData,
      };
    });
    // set(clickedVector + "_graph", {
    //   graphData: tempGraphData,
    //   thresholds: {...state.thresholds[clickedVector]} as threshMap,
    //   missingNodes: missingNodes
    // });
    console.log("graph data: ", tempGraphData);
    actions.updateIsLoading({ isLoading: false });
  };

  return (
    <div className="result-container">
      <div className="vector-bar">
        <VectorsButtons
          vectorsValues={state.vectorsHeaders}
          setClickedVector={setClickedVector}
          clickedVector={clickedVector}
        />
      </div>
      {state.isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="graph-wrapper">
          <div className="graph-buttons">
            <GraphBar
              openTable={openTable}
              setOpenTable={setOpenTable}
              nodesNum={graphData.nodes.length}
              linksNum={graphData.links.length}
              missingNodes={missingNodes}
              thresholds={thresholds}
              setThresholds={setThresholds}
            />
          </div>
          <div className="graph-canvas">
            {error && <ErrorScreen />}
            {!error && openTable && <TableComponent data={graphData} />}
            {!error && !openTable && font && (
              <CytoscapejsComponentself
                graphData={graphData}
                clickedVector={clickedVector}
                alertLoading={() => {}}
              />
            )}
          </div>
        </div>
      )}
      {tooManyModal[clickedVector] > 0 && (
        <div className="tooManyModal">
          <div className="tooManyModal-content">
            <p>Your requested graph <b>will contain {tooManyModal[clickedVector]} nodes</b>. if this is a mistake please change the thresholds to filter more nodes.</p>
            <p>if you wish to proceed anyway, please note that you may experience some performance issues</p>
            <br/>
            <p>Note: This message will appear untill there are at most {MAX_NODES_PER_GRAPH} nodes and it is individual to each graph</p>
            <div className="threashold-row">
              <label className="thresholdTitle" htmlFor="positiveThreshold">P. Threshold: </label>
              <input
                id="positiveThreshold"
                type="number"
                step="0.01"
                className="text-input"
                min={0}
                max={1}
                value={tooManyThresholds.pos}
                required
                onChange={(e) => setTooManyThresholds({ ...tooManyThresholds, pos: Number(e.target.value) })}
              />
              <label className="thresholdTitle" htmlFor="negativeThreshold">N. Threshold: </label>

              <input
                id="negativeThreshold"
                type="number"
                step="0.01"
                className="text-input"
                min={-1}
                max={0}
                value={tooManyThresholds.neg}
                required
                onChange={(e) => setTooManyThresholds({ ...tooManyThresholds, neg: Number(e.target.value) })}
              />
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <button type="button" className="btn btn--warning" onClick={() => {
                setTooManyModal({...tooManyModal, [clickedVector]: -1});
                actions.updateThresholds({thresholds: {...state.thresholds, [clickedVector]: {...tooManyThresholds}}});
              }}>CONTINUE ANYWAY</button>
              <button type="button" className="btn btn--outline" onClick={() => {
                if (thresholds == state.thresholds[clickedVector]) return;
                setTooManyModal({...tooManyModal, [clickedVector]: 0});
                actions.updateThresholds({thresholds: {...state.thresholds, [clickedVector]: {...tooManyThresholds}}});
              }}>UPDATE THRESHOLDS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
