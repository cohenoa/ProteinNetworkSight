import React from "react";
import { FC, useEffect, useState } from "react";
import { GraphDataMem, ICustomGraphData } from "../@types/graphs";
import VectorsButtons from "../bars/VectorsButtons";
import LoadingComponent from "../components/Loading";
import GraphBar from "../bars/GraphBar";
import TableComponent from "../components/Table";
import { useStateMachine } from "little-state-machine";
import { updateIsLoading, updateShowError, updateThresholds, updateTooManyModal } from "../common/UpdateActions";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import "../styles/Result.css";
import ErrorScreen from "../components/ErrorScreen";
import CytoscapejsComponentself from "../components/Cytoscapejs";
import { set, update } from 'idb-keyval';
import { threshMap, Missing } from "../@types/global";
import { graphRef, IStepProps } from "../@types/props";
import TooManyPopUp from "../components/tooManyPopUp";

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
    drugs: {},
  });

  const [missingNodes, setMissingNodes] = useState<Missing>([]);
  const [alternativeNames, setAlternativeNames] = useState<[string, string][]>([]);
  const [openTable, setOpenTable] = useState<boolean>(false);
  const [thresholds, setThresholds] = useState<threshMap>({
    pos: state.thresholds[clickedVector].pos,
    neg: state.thresholds[clickedVector].neg,
  });

  const [currGraphRef, setCurrGraphRef] = useState<graphRef>(React.createRef<graphRef>() as graphRef);

  useEffect(() => {
    const fetchData = async () => {
      try {
          setClickedVector(state.vectorsHeaders[0]);
          let loader = new FontLoader();
          loader.load(
            "https://threejs.org/examples/fonts/optimer_regular.typeface.json",
            (loaded_font) => {
              setFont(loaded_font);
            }
          );
      } catch (err) {
        console.log('failed loading font!', err);
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
    }
  }, [thresholds]);

  const handleError = (err: string) => {
    console.log("error in makePostRequest", err);
    setError(true);
    actions.updateIsLoading({ isLoading: false });
  };

  const getGraphData = (vector: string) => {
    console.log("getting graph data for vector: ", vector);
    setError(false);
    actions.updateIsLoading({ isLoading: true });

    getGraphOfVector(vector, state.thresholds[vector], state.scoreThreshold, state.tooManyModal[vector] < 0, handleJsonGraphData, handleError).then((res) => {
      if (typeof res === "number") {
        actions.updateTooManyModal({ tooManyModal: {...state.tooManyModal, [vector]: res }});
        return;
      }
      res = res as GraphDataMem;

      setMissingNodes(res.missingNodes);
      setAlternativeNames(res.alternatives);

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

  const setClickedVectorWrapper = (vector: string) => {
    currGraphRef.current?.stopLayout();
    setClickedVector(vector);
    
  }

  const setOpenTableWrapper = (open: boolean) => {
    currGraphRef.current?.stopLayout();
    setOpenTable(open);
  };

  const setThresholdsWrapper = (thresholds: threshMap) => {
    currGraphRef.current?.stopLayout();
    setThresholds(thresholds);
  }

  return (
    <div className="result-container">
      <div className="vector-bar">
        <VectorsButtons
          vectorsValues={state.vectorsHeaders}
          setClickedVector={setClickedVectorWrapper}
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
              setOpenTable={setOpenTableWrapper}
              nodesNum={graphData.nodes.length}
              linksNum={graphData.links.length}
              missingNodes={missingNodes}
              alternativeNames={alternativeNames}
              thresholds={thresholds}
              setThresholds={setThresholdsWrapper}
            />
          </div>
          <div className="graph-canvas">
            {error && <ErrorScreen />}
            {!error && openTable && <TableComponent data={graphData} clickedVector={clickedVector} />}
            {!error && !openTable && font && (
              <CytoscapejsComponentself
                graphData={graphData}
                clickedVector={clickedVector}
                alertLoading={() => {}}
                ref={currGraphRef}
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
    </div>
  );
};

export default Result;
