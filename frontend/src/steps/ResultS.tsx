import { FC, useEffect, useState } from "react";
import { ICustomGraphData } from "../@types/graphs";
import VectorsButtons from "../bars/VectorsButtons";
import LoadingComponent from "../components/Loading";
import GraphBar from "../bars/GraphBar";
import TableComponent from "../components/Table";
import { useStateMachine } from "little-state-machine";
import { updateIsLoading, updateShowError, updateThresholds, updateTooManyModal } from "../common/UpdateActions";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import "../styles/Result.css";
import "../styles/TooManyModal.css";
import ErrorScreen from "../components/ErrorScreen";
import CytoscapejsComponentself from "../components/Cytoscapejs";
import { update } from 'idb-keyval';
import { threshMap, Missing } from "../@types/global";
import { IStepProps } from "../@types/props";
import TooManyPopUp from "../components/tooManyPopUp";

import { MAX_NODES_PER_GRAPH } from "../Constants";
import { getGraphOfVector } from "../common/Helpers";

const Result: FC<IStepProps> = ({ step, goNextStep }) => {
  const { state, actions } = useStateMachine({
    updateIsLoading,
    updateShowError,
    updateThresholds,
    updateTooManyModal
  });

  const [clickedVector, setClickedVector] = useState<string>(state.vectorsHeaders[0]);
  const [graphData, setGraphData] = useState<ICustomGraphData>({
    nodes: [],
    links: [],
  });

  const [missingNodes, setMissingNodes] = useState<Missing>([]);
  const [openTable, setOpenTable] = useState<boolean>(false);
  const [tooManyThresholds, setTooManyThresholds] = useState<threshMap>({
    pos: state.thresholds[clickedVector].pos,
    neg: state.thresholds[clickedVector].neg,
  });
  const [thresholds, setThresholds] = useState<threshMap>({
    pos: state.thresholds[clickedVector].pos,
    neg: state.thresholds[clickedVector].neg,
  });

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

  const getGraphData = (vector: string) => {
    console.log("getting graph data");
    setError(false);
    console.log(vector);
    actions.updateIsLoading({ isLoading: true });

    getGraphOfVector(vector, state.thresholds[vector], state.scoreThreshold, state.tooManyModal[vector] < 0, handleJsonGraphData, handleError).then((res) => {
      if (typeof res === "number") {
        actions.updateTooManyModal({ tooManyModal: {...state.tooManyModal, [vector]: res }});
        setTooManyThresholds({...state.thresholds[vector]});
        return;
      }

      res = res as {graphData: ICustomGraphData | null, missingNodes: Missing};

      setMissingNodes(res.missingNodes);

      if (res.graphData) {
        setGraphData(res.graphData);
        actions.updateIsLoading({ isLoading: false });
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
      {state.tooManyModal[clickedVector] > 0 && (<TooManyPopUp
        clickedVector={clickedVector}
        thresholds={thresholds}
        specifyVector={false}
      />)}
      {/* {state.tooManyModal[clickedVector] > 0 && (
        <div className="tooManyModal">
          <div className="tooManyModal-content">
            <p>Your requested graph <b>will contain {state.tooManyModal[clickedVector]} nodes</b>. if this is a mistake please change the thresholds to filter more nodes.</p>
            <p>if you wish to proceed anyway, please note that you may experience some performance issues</p>
            <br/>
            <p>Note: This message will appear until there are at most {MAX_NODES_PER_GRAPH} nodes and it is individual to each graph</p>
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
                actions.updateTooManyModal({ tooManyModal: {...state.tooManyModal, [clickedVector]: -1 }});
                actions.updateThresholds({thresholds: {...state.thresholds, [clickedVector]: {...tooManyThresholds}}});
              }}>CONTINUE ANYWAY</button>
              <button type="button" className="btn btn--outline" onClick={() => {
                if (thresholds == state.thresholds[clickedVector]) return;
                actions.updateTooManyModal({ tooManyModal: {...state.tooManyModal, [clickedVector]: 0 }});
                actions.updateThresholds({thresholds: {...state.thresholds, [clickedVector]: {...tooManyThresholds}}});
              }}>UPDATE THRESHOLDS</button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Result;
