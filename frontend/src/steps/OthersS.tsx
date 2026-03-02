import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ISuggestionsJson } from "../@types/json";
import { IStepProps } from "../@types/props";
import { useStateMachine } from "little-state-machine";
import { updateUuid, updateIsLoading, updateShowError } from "../common/UpdateActions";
import "../styles/Others.css";
import ErrorInputText from "../components/ErrorInputText";
import { getMany } from "idb-keyval";
import { INamesStringMap } from "../@types/global";

import { NO_STRING_ID, NO_STRING_NAME } from "../Constants";

type namesFormValues = {
  [key: string]: string;
};

const OthersS: FC<IStepProps> = ({ step, goNextStep }) => {
  const { state, actions } = useStateMachine({ updateUuid, updateIsLoading, updateShowError });
  const [othersNames, setOthersNames] = useState<{ orgName: string; stringName: string }[]>([]);

  const { handleSubmit } = useForm<namesFormValues>({});

  useEffect(() => {
    getMany(["suggestionsObj", "namesStringMap"]).then(([suggestionsObj, namesStringMap]) => {
      console.log("no match: ", (suggestionsObj as ISuggestionsJson).no_match);
      if (!suggestionsObj || !namesStringMap) {
        actions.updateShowError({ showError: true });
        return;
      };

      const other_unset = new Set(Object.entries(namesStringMap as INamesStringMap).filter(([orgName, {stringName, stringId}]) => stringId === NO_STRING_ID).map(([orgName]) => orgName));
      const other_set = new Set((suggestionsObj as ISuggestionsJson).no_match.filter((orgName) => (!other_unset.has(orgName))));
      console.log("other_set: ", other_set);


      const othersList = Array.from(other_set).map((orgName) => ({ orgName: orgName, stringName: namesStringMap[orgName].stringName })).concat(Array.from(other_unset).map((orgName) => ({orgName: orgName, stringName: NO_STRING_NAME})));
      othersList.sort(({orgName: orgName1, stringName: stringName1}, {orgName: orgName2, stringName: stringName2}) => orgName1.localeCompare(orgName2));
      console.log("othersList: ", othersList);
      setOthersNames(othersList);
    });
  }, []);

  const onSubmit = () => {
    goNextStep();
  };

  return (
    <div className="suggestions-scroll">
      <form id={"form" + step} onSubmit={handleSubmit(onSubmit)}>
        {othersNames.map(({orgName, stringName}) => {
          return <ErrorInputText key={orgName} orgName={orgName} stringName={stringName !== NO_STRING_NAME ? stringName : ""} />;
        })}
      </form>
    </div>
  );
};

export default OthersS;
