import { FC } from "react";
import "../styles/Explanation.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiagramProject, faDownload, faFloppyDisk, faArrowPointer, faPencil, faComputerMouse, faBrush, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';

const GraphExplanation: FC = () => {
  return (
    <div className="explanation">
      <p className="welcome">
        We use your data combined with STRING-db data to create graph that shows
        current interactions
      </p>
      <p className="please">
        The obtained network includes the input values represented by nodes. 
        The edges are adapted from STRING-db.
      </p>
      <p className="please">
        If the resulting network has too many nodes, you will be prompted to modify the thresholds
        so you can get a readable graph(optional).
      </p>
      <p className="please">
        in this page you can interact with individual graphs. 
        if you wish to download your data or all the graphs at once click the "save" button below.
      </p>
      <ul>
        <span>Nodes:</span>
        <li className="must-item">
          <i className="fa fa-question-circle-o" style={{ color: "black" }} />
          Network nodes represent proteins \ genes.
        </li>
        <li className="must-item">
          <i className="fa fa-circle" style={{ color: "blue" }} />
          Blue node - positive value(default).
        </li>
        <li className="must-item">
          <i className="fa fa-circle" style={{ color: "red" }} />
          Red node - negative value(default).
        </li>
        <li className="must-item">
          <i className="fa fa-circle-thin" style={{ fontSize: "25px" }} />
          Node size proportional to input value.
        </li>
        <li className="must-item">
          <i className="fa fa-info" style={{ fontSize: "25px" }} />
          Click a node to view its details, and access related resources(UniProt, drugBank)
        </li>
        <li className="must-item">
          <i className="fa fa-question-circle-o" style={{ color: "black" }} />
          “Missing Nodes” lists proteins that passed the threshold filtering but could not be matched to entries in STRING. Assign an identifier to these proteins in Step 4 to include them in the analysis.
        </li>
        <li className="must-item">
          <i className="fa fa-question-circle-o" style={{ color: "black" }} />
          “Nodes worth reviewing” lists proteins in the network that were matched with an alternative name in step 3, and you might not have reviewed their accuracy.
        </li>
        <span>Edges:</span>
        <li className="must-item">
          <i className="fa fa-question-circle-o" style={{ color: "black" }} />
          Edges represent protein-protein interactions.
        </li>
        <li className="must-item">
          <i
            className="fa fa-minus"
            style={{ color: "lightgray", fontSize: "25px" }}
          />
          edge width - strength of protein-protein interaction
        </li>
        <span>Options:</span>
        <li className="must-item">
          <FontAwesomeIcon className="icon" icon={faArrowPointer} fixedWidth={true} style={{ fontSize: "20px" }}/>
          move any node by dragging it with the mouse
        </li>
        <li className="must-item">
          <FontAwesomeIcon className="icon" icon={faComputerMouse} fixedWidth={true} style={{ fontSize: "20px" }}/>
          zoom in or out by scrolling to focus on a specific part of the graph
        </li>
        <li className="must-item">
          <FontAwesomeIcon className="icon" icon={faComputerMouse} fixedWidth={true} style={{ fontSize: "20px" }}/>
          use the right click menu to cutomize your graph!
        </li>
        <li className="must-item">
          <FontAwesomeIcon className="icon" icon={faDiagramProject} fixedWidth={true} style={{ fontSize: "20px" }}/>
          change the Layout of the nodes to gain valuable insight
        </li>
        <li className="must-item">
          <FontAwesomeIcon className="icon" icon={faUpRightAndDownLeftFromCenter} fixedWidth={true} style={{ fontSize: "20px" }}/>
          change the size of the nodes to your liking
        </li>
        <li className="must-item">
          <FontAwesomeIcon className="icon" icon={faBrush} fixedWidth={true} style={{ fontSize: "20px" }}/>
          change the color of the nodes to your liking
        </li>
        <li className="must-item">
          <FontAwesomeIcon className="icon" icon={faPencil} fixedWidth={true} style={{ fontSize: "20px" }}/>
          change the opacity of the edges to your liking
        </li>
        <li className="must-item">
          <FontAwesomeIcon className="icon" icon={faFloppyDisk} fixedWidth={true} style={{ fontSize: "20px" }}/>
          like the layout? Save it so you can come back to it later!
        </li>
        <li className="must-item">
          <FontAwesomeIcon className="icon" icon={faFloppyDisk} fixedWidth={true} style={{ fontSize: "20px" }}/>
          reload your saved graph from the right click menu
        </li>
        <li className="must-item">
          <FontAwesomeIcon className="icon" icon={faDownload} fixedWidth={true} style={{ fontSize: "20px" }}/>
          download the graph in a varaiaty of formats from the right click menu
        </li>
        <span>Table:</span>
        <li className="must-item">
          <i className="fa fa-info" style={{ color: "black" }} />
          Table can help you see the actual data represented by the graph and the current mapping to STRING names
        </li>
        <li className="must-item">
          <i className="fa fa-sort-amount-desc" style={{ color: "black" }} />
          You can sort the table by any column by clicking on the column header
        </li>
      </ul>
    </div>
  );
};

export default GraphExplanation;
