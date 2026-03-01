import { FC } from "react";
import { downloadExampleFile } from "../common/ExampleFileAction";
import "../styles/Explanation.css";

import { MAX_LINES_PER_FILE } from "../Constants";

const FileUploadExplanation: FC = () => {
  return (
    <div className="explanation">
      <p className="welcome"> Welcome to the first step!</p>
      <p className="please">Please upload an Excel file containing the data.</p>
      <ul>
        <span>Notice:</span>
        <li className="must-item">
          <i className="fa fa-exclamation-circle" />
          The file must be in xlsx/csv/txt format.
        </li>
        <li className="must-item">
          <i className="fa fa-exclamation-circle" />
          The file must contain only one sheet.
        </li>
        <li className="must-item">
          <i className="fa fa-exclamation-circle" />
          There should be a column with protein/gene names.
        </li>
        <li className="must-item">
          <i className="fa fa-exclamation-circle" />
          All columns which include numeric values should be named with
          consistent headers (i.e., start with the same prefix, see example in
          the tutorial)
        </li>
        <li className="must-item">
          <i className="fa fa-exclamation-circle" />
          Make sure the file has less then {MAX_LINES_PER_FILE} genes and 2 columns or more.
        </li>
        <li className="must-item">
          <i className="fa fa-exclamation-circle" />
          <button onClick={downloadExampleFile} className="dnld-example">
            download example file
          </button>
        </li>
      </ul>
    </div>
  );
};

export default FileUploadExplanation;
