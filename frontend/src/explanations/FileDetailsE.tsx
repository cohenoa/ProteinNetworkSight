import { FC } from "react";
import "../styles/Explanation.css";

const FileDetailsExplanation: FC = () => {
  return (
    <div className="explanation">
      <p className="welcome">Second step: SET PARAMETERS AND THRESHOLDS</p>
      <ul>
        <li className="must-item">
          <i className="fa fa-check-circle-o" />
          Name the columns as detailed in the tutorial
        </li>
        <li className="must-item">
          <i className="fa fa-check-circle-o" />
          Check the prefix of the columns that contain the numeric values to have the prefix provided in the tutorial.
        </li>
        <li className="must-item">
          <i className="fa fa-check-circle-o" />
          The score threshold are the interaction thresholds as defined by
          STRING-db
        </li>
        <li className="must-item">
          <i className="fa fa-check-circle-o" />
          Set Positive and Negative thresholds to filter nodes with low scores
        </li>
        <li className="must-item">
          <i className="fa fa-check-circle-o" />
          Click Manual Thresholds to apply a thresholds manually for each vector
        </li>
        <li className="must-item">
          <i className="fa info" />
          Note that the Pos&Neg threholds are selected based on where the thresholds was last changed
        </li>
        <li className="must-item">
          <i className="fa fa-check-circle-o" />
          To build networks and adjust drugs choose “Homo Sapiens”. To build
          just networks, select any other organism.
        </li>
      </ul>
    </div>
  );
};

export default FileDetailsExplanation;
