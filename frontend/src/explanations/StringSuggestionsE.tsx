import { FC } from "react";
// import "../styles/FileDetails.css";

const StringSuggestionsExplanation: FC = () => {
  return (
    <div className="explanation">
      <p className="welcome">
        Third step: Adjust protein\gene names based on STRING
      </p>
      <p className="please">
        For some proteins\genes more than a single name was matched on
        STRING-db.
      </p>
      <ul>
        <li className="must-item">
          <i className="fa fa-eye-slash" />
          The protein names with an exact match are not presented.
        </li>

        <li className="must-item">
          <i className="fa fa-toggle-on" />
          Select the right name for protein with several options
        </li>

        <li className="must-item">
          <i className="fa fa-toggle-right" />
          If no name matches, select “other” and you will be able to manually insert a name in the next step
        </li>
      </ul>
    </div>
  );
};

export default StringSuggestionsExplanation;
