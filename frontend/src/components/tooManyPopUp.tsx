
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
            <p>{specifyVector ? 'The graph for ' + clickedVector : 'Your requested graph'} <b>will contain {state.tooManyModal[clickedVector]} nodes</b>. if this is a mistake please change the thresholds to filter more nodes.</p>
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
    )
}

export default TooManyModal