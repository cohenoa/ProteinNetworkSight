import { FC } from "react";
import { ISwitchableProps } from "../@types/props";
import Switch, { Item } from "react-switchable-next";
import "react-switchable-next/dist/index.esm.css";
import { INamesStringMap } from "../@types/global";
import "../styles/Switchable.css";

import { NO_STRING_ID, NO_STRING_NAME } from "../Constants";

const Switchable: FC<ISwitchableProps> = ({setNamesStringMap, orgName, suggestions, selected}) => {
  const valDelim = ":";

  const createValue = (strName: string, strId: number) => {
    return orgName + valDelim + strName + valDelim + String(strId);
  };

  const splitValue = (value: string) => {
    const splited = value.split(valDelim);
    return {
      orgName: splited[0],
      strName: splited[1],
      strID: Number(splited[2]),
    };
  };

  const onItemChanged = (value: string) => {
    const { orgName, strName, strID } = splitValue(value);
    setNamesStringMap((prev: INamesStringMap): INamesStringMap => {
      return {
        ...prev,
        [orgName]: {
          stringName: strName,
          stringId: strID,
        },
      };
    });
  };

  const createItems = () => {
    const items = Object.entries(suggestions).map(([strName, stringId]) => {
      const value = createValue(strName, stringId);
      return (
        <Item
          key={strName}
          default={selected === strName}
          value={value}
        >
          {strName}
        </Item>
      );
    });

    const otherKey = NO_STRING_NAME;
    const otherValue = createValue(NO_STRING_NAME, NO_STRING_ID);
    items.push(
      <Item
        key={otherKey}
        default={selected === NO_STRING_NAME}
        value={otherValue}
      >
        {otherKey}
      </Item>
    );
    return items;
  };

  return (
    <div className="fieldset-container suggestionsSwitch">
      <label className="protein-label">{orgName}:</label>
      {/* @ts-ignore */}
      <Switch name={orgName} onItemChanged={onItemChanged}>
        {createItems()}
      </Switch>
    </div>
  );
};

export default Switchable;
