import { FC } from "react";

const SaveResultsExplanations: FC = () => {
  return (
    <div className="explanation">
      <p className="welcome">
        Saving your results!
      </p>
      <p className="please">
        This is where you can download a new data file with STRING mappings and all of your graphs.
      </p>
      <ul>
        <span>Saving data file:</span>
        <li className="must-item">
          <i className="fa">{String.fromCharCode(8594)}</i>
           replace your name with the STRING match in the new data file
        </li>

        <li className="must-item">
          <i className="fa fa-info" />
          replacement STRING names reserves protein/gene modifications(suffix starting with '_')
        </li>

        <li className="must-item">
        <i className="fa">{String.fromCharCode(0x274C)}</i>
          delete names without STRING match from the new data file
        </li>

        <li className="must-item">
          <i className="fa fa-info" />
          use the buttons at the bottom to apply a change to the whole list
        </li>

        <li className="must-item">
          <i className="fa fa-info" />
          click the save button to download your new data file!
        </li>
      </ul>

      <ul>
        <span>Saving Graphs:</span>

        <li className="must-item">
          <i className="fa fa-info" />
          the list is initialized with your saved settings(or default when there is no saved layout).
        </li>

        <li className="must-item">
          <i className="fa fa-info" />
          apply your desired layout, node size, node color, edge opcaity, file type for each graph individually
        </li>

        <li className="must-item">
          <i className="fa fa-info" />
          use the top menu to apply changes to the whole list. note that this will override whatever setting is currently applied
        </li>

        <li className="must-item">
          <i className="fa fa-info" />
          mark the "Use saved when possible" checkbox to avoid overriding saved layouts when using the apply all menu
        </li>

        <li className="must-item">
          <i className="fa fa-info" />
          use the save button in the bottom of the page to download all the graphs at once. note that this might take a while
        </li>

      </ul>

    </div>
  );
};

export default SaveResultsExplanations;