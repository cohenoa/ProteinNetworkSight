
import React, { useState } from "react";
import { useStateMachine } from "little-state-machine";
import { threshMap } from "../@types/global";
import "../styles/TooManyModal.css";
import { updateThresholds, updateTooManyModal } from "../common/UpdateActions";

import {MAX_NODES_PER_GRAPH } from "../Constants";

const TooManyModal = ({clickedVector, thresholds, specifyVector}: {clickedVector: string, thresholds: threshMap, specifyVector: boolean}) => {
    const { state, actions } = useStateMachine({
        updateTooManyModal,
        updateThresholds,
    });

    const [tooManyThresholds, setTooManyThresholds] = useState<threshMap>({
        pos: state.thresholds[clickedVector].pos,
        neg: state.thresholds[clickedVector].neg,
    });

    return (
        <div className="tooManyModal">
          <div className="tooManyModal-content">
            <p>{specifyVector ? 'The graph for ' + clickedVector : 'The requested graph '} will contain <b>{state.tooManyModal[clickedVector]} nodes</b>. For better performance, we recommend adjusting the thresholds to reduce the number of nodes.</p>
            <p>You may still continue, but rendering a large network may affect performance.</p>
            <br/>
            <p>Note: This message appears when a graph exceeds {MAX_NODES_PER_GRAPH} nodes. The limit is applied individually to each graph.</p>
            <div className="threashold-row">
              <label className="thresholdTitle" htmlFor="positiveThreshold">Positive Threshold: </label>
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
              <label className="thresholdTitle" htmlFor="negativeThreshold">Negative Threshold: </label>

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
    )
}

export default TooManyModal