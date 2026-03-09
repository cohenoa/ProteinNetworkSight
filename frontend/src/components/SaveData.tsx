import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useStateMachine } from "little-state-machine";
import { updateIsLoading, updateShowError } from "../common/UpdateActions";
import { getMany } from 'idb-keyval';
import "../styles/SaveData.css";
import ButtonsBar from "../bars/FormNavigateBar";
import { IButtonConfig, nameStatus, replaceNameStatus } from "../@types/props";
import { write, utils } from "xlsx";
import { INamesStringMap } from "../@types/global";

import { getMod } from "../common/Helpers";
import { NO_STRING_ID, SAVED_NAMES_COLUMN_TITLE, SAVED_NUMERIC_COLUMN_PREFIX_TITLE, SAVED_ORGANISM_TITLE, SAVED_STRING_ID_TITLE, SAVED_STRING_NAME_TITLE, SAVED_STRING_SCORE_THRESHOLD_TITLE } from "../Constants";

const SaveData = forwardRef((props, ref) => {

    const { state, actions } = useStateMachine({
        updateIsLoading,
        updateShowError,
    });

    const [replacementMap, setReplacementMap] = useState<{ [key: string]: replaceNameStatus }>({});
    const [unMatchedMap, setUnMatchedMap] = useState<{ [key: string]: nameStatus }>({});

    async function getMainContent(){
        const headersValues = columnsToRows(await getMany(state.headers.map((header) => header + "_data")));
        const [namesStringMap, proteinsNames] = await getMany(["namesStringMap", "proteinsNames"]);

        let content = [[state.idHeader, SAVED_STRING_NAME_TITLE, SAVED_STRING_ID_TITLE].concat(state.vectorsHeaders)];

        (proteinsNames as string[]).forEach((name, index) => {
            if (name in unMatchedMap && unMatchedMap[name].accepted) return;
            const match = namesStringMap[name];

            let orgName = name;
            let orgSTRINGname = match.stringName;
            let orgSTRINGId = String(match.stringId);

            if (orgSTRINGId === String(NO_STRING_ID)) {
                orgSTRINGname = "";
                orgSTRINGId = "";
            };

            if (name in replacementMap && replacementMap[name].accepted) {
                orgName = replacementMap[name].string_name
            }

            content.push([orgName, orgSTRINGname, orgSTRINGId, ...headersValues[index]]);
        })
        return content;
    }

    function getThresholdsContent(){
        let content = [['Threshold\\Header'].concat(state.vectorsHeaders)];

        const posThresh = Object.entries(state.thresholds).map(([key, value]) => String(value.pos));
        content.push(["Positive Threshold"].concat(posThresh));

        const negThresh = Object.entries(state.thresholds).map(([key, value]) => String(value.neg));
        content.push(["Negative Threshold"].concat(negThresh));

        return content;
    }

    function getMetaDataContent(){
        let content = [[SAVED_STRING_SCORE_THRESHOLD_TITLE, String(state.scoreThreshold)]];

        content.push([SAVED_ORGANISM_TITLE, String(state.organism.label), String(state.organism.value)]);

        content.push([SAVED_NUMERIC_COLUMN_PREFIX_TITLE, String(state.vectorsPrefix)]);

        content.push([SAVED_NAMES_COLUMN_TITLE, String(state.idHeader)]);

        return content;
    }

    useImperativeHandle(ref, () => ({
        getFormData: async () => {
            actions.updateIsLoading({ isLoading: true });

            const mainContent = await getMainContent();
            const thresholdsContent = getThresholdsContent();
            const metaDataContent = getMetaDataContent();

            const workbook = utils.book_new();
            const worksheet = utils.aoa_to_sheet(mainContent);
            utils.book_append_sheet(workbook, worksheet, "Sheet1");

            const worksheet2 = utils.aoa_to_sheet(thresholdsContent);
            utils.book_append_sheet(workbook, worksheet2, "Sheet2");

            const worksheet3 = utils.aoa_to_sheet(metaDataContent);
            utils.book_append_sheet(workbook, worksheet3, "Sheet3");
        
            // Create a Blob from the workbook
            const file = write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([file], { type: "application/octet-stream" });
        
            // Create a download link and click it programmatically
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${state.fileName.split('.')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            actions.updateIsLoading({ isLoading: false });
        }
    }));

    function columnsToRows<T>(columns: T[][]): T[][] {
        columns = columns.filter(c => c !== undefined);
        const rowCount = Math.max(...columns.map(c => c.length));
        const rows = Array.from({ length: rowCount }, () => Array(columns.length));

        for (let col = 0; col < columns.length; col++) {
            const column = columns[col];
            for (let row = 0; row < column.length; row++) {
            rows[row][col] = column[row];
            }
        }

        return rows;
    }

    useEffect(() => {
        actions.updateIsLoading({ isLoading: true });
        getData();
        actions.updateIsLoading({ isLoading: false });
    }, []);

    const getData = async() => {

        let altmap: { [key: string]: replaceNameStatus } = {};
        let manmap: { [key: string]: replaceNameStatus } = {};
        let unMatched: { [key: string]: nameStatus } = {};

        const [suggestionsObj, namesStringMap] = await getMany(["suggestionsObj", "namesStringMap"]);
        for (const [name, match] of Object.entries(namesStringMap as INamesStringMap)) {
            if (match === undefined || match === null || typeof match !== "object" || !("stringName" in match) || !("stringId" in match)) continue;

            const mod = getMod(name);
            if (name in suggestionsObj.alternative_match) {
                altmap[name] = { string_name: match.stringName + mod, string_id: match.stringId, accepted: false } as replaceNameStatus;
            } else if (suggestionsObj.no_match.includes(name) && match.stringId !== NO_STRING_ID) {
                manmap[name] = {string_name: match.stringName + mod, string_id: match.stringId, accepted: false} as replaceNameStatus;
            }
            else if (match.stringId === NO_STRING_ID) {
                unMatched[name] = {accepted: false} as nameStatus;
            }
        }

        console.log(altmap);
        console.log(manmap);
        console.log(unMatched);
        let replacementMap: { [key: string]: replaceNameStatus } = {...manmap, ...altmap};
        console.log(replacementMap);

        setReplacementMap(replacementMap);
        setUnMatchedMap(unMatched);

    }

    const handleformAllAction = (setFunc: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>, map: { [key: string]: any}, status: boolean) => {
        setFunc(applyAll(map, status));
    }

    const applyAll = (map: { [key: string]: any}, status: boolean) => {
        const newMap: { [key: string]: any } = {};
        for (const [key, value] of Object.entries(map)) {
            newMap[key] = {...value, accepted: status};
        }
        return newMap;
    }

    // formbool helps distinguish between the form for replacement names and the form for unMatched names
    const renderButtonBar = (replaceForm: boolean) => {
        const reset: IButtonConfig = {
          label: "Reset",
          type: "button",
          className: "btn btn--outline btn--medium",
          onClick: () => {
            console.log("Reset " + replaceForm? "replace form":"unused form");
            handleformAllAction(replaceForm? setReplacementMap: setUnMatchedMap, replaceForm? replacementMap: unMatchedMap, false);
          },
        };

        const replaceAll: IButtonConfig = {
          label: replaceForm? "Replace All" : "Remove All",
          type: "button",
          className: "btn btn--outline btn--medium",
          onClick: () => {
            console.log("mark all " + replaceForm? "replace form":"unused form");
            handleformAllAction(replaceForm? setReplacementMap: setUnMatchedMap, replaceForm? replacementMap: unMatchedMap, true);
          },
        };
        
        return <ButtonsBar buttons={[reset, replaceAll]} formId="saveDataForm"/>;
    }

    const changeStatus = (name: string, match: nameStatus, map: { [key: string]: nameStatus }, setMap: React.Dispatch<React.SetStateAction<any>>) => {
        const updatedMap = {
            ...map,
            [name]: {
                ...match,
                accepted: !match.accepted
            }
        };
        setMap(updatedMap);
    }

    const renderAltMap = (name: string, match: replaceNameStatus | nameStatus, index: number) => {

        const isReplace = "string_name" in match;

        const nameClass = isReplace ? "replaceName" : "unMatchedName";
        const orgNameStatusClass = match.accepted ? " cancledOriginalName" : " originalName";
        const StringNameStatusClass = match.accepted ? " chosenSTRINGName" : " STRINGName";

        const map = isReplace ? replacementMap : unMatchedMap;
        const setMap = isReplace ? setReplacementMap : setUnMatchedMap;

        const att = {
            orgNameClass: nameClass.concat(orgNameStatusClass),
            StringNameClass: nameClass.concat(StringNameStatusClass),
            btnClass: isReplace? "ItemBtn" : "ItemBtn removeBtn",
            acceptedBtnSymbol: String.fromCharCode(8635),
            notAcceptedBtnSymbol: isReplace? String.fromCharCode(8594): String.fromCharCode(0x274C),
        }

        return (
            <div key={index} className="ItemContainer">
                <div className={att.orgNameClass}>{name}</div>
                <button type="button" className={att.btnClass} onClick={() => changeStatus(name, match, map, setMap)}>{match.accepted? att.acceptedBtnSymbol : att.notAcceptedBtnSymbol}</button>
                {isReplace && <div className={att.StringNameClass}>{match.string_name}</div>}
            </div>
        )
    }

    return (
        <div className="saveData">
            <div className="SectionWrapper">
                <div className="SectionTitle">
                    <label>Replace Matched Names</label>
                </div>
                <div className="SectionContent">
                    <form id="saveDataForm1">
                        {Object.entries(replacementMap).map(([name, match], index) => renderAltMap(name, match, index))}
                    </form>
                </div>
                <div className="SectionFooter">
                    {renderButtonBar(true)}
                </div>
            </div>
            <div className="SectionWrapper">
                <div className="SectionTitle">
                    <label>Remove Unmatched Names</label>
                </div>
                <div className="SectionContent">
                    <form id="saveDataForm2">
                        {Object.entries(unMatchedMap).map(([name, match], index) => renderAltMap(name, match, index))}
                    </form>
                </div>
                <div className="SectionFooter">
                    {renderButtonBar(false)}
                </div>
            </div>
        </div>
    )
});

export default SaveData;