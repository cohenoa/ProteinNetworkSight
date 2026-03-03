import { FC } from "react";

const OthersE: FC = () => {
  return (
    <div className="explanation">
      <p className="welcome">Fourth step: SET PROTEIN\GENE names MANUALLY</p>
      <ul>
        <li className="must-item">
          <i className="fa fa-info" />
          The name of protein\gene should be recognized by STRING-DB
        </li>
        <li className="must-item">
          <i className="fa fa-info" />
          This step is validated using STRING
        </li>
        <li className="must-item">
          <i className="fa fa-info" />
          Note: the user should confirm the accuracy of the names
        </li>
        <li className="must-item">
          <i className="fa fa-info" />
          Proteins\genes without a valid name will be excluded from the network
          and the output tables
        </li>
      </ul>
    </div>
  );
};

export default OthersE;
