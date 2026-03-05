import { GraphDataMem, ICustomGraphData } from "../@types/graphs";
import { makePostRequest } from "../common/PostRequest";
import { set, getMany } from 'idb-keyval';
import { INamesStringMap, threshMap, Missing, MissingItem } from "../@types/global";

import { MAX_NODES_PER_GRAPH, NO_STRING_ID } from "../Constants";


export const isGraphMemValuesValid = (
        graphData: ICustomGraphData, 
        memThresholds: threshMap, 
        selectedThreholds: threshMap,
        missingNodes: {orgName: string, value: number}[], 
        namesStringMap: INamesStringMap) => {


    if (!graphData) return false;

    if (memThresholds.pos !== selectedThreholds.pos || memThresholds.neg !== selectedThreholds.neg) return false;

    for (const missingNode of missingNodes){
        if (namesStringMap[missingNode.orgName].stringId !== NO_STRING_ID) return false;
    }

    for (const node of graphData.nodes) {
        if (namesStringMap[node.id].stringId === NO_STRING_ID) return false;
    }
    return true;
}

export async function getGraphOfVector(
    header: string, 
    thresholds: threshMap, 
    scoreThreshold: number, 
    ignoreMissing: boolean, 
    handleData: (jsonString: string) => void, 
    handleError?: (error: string) => void): Promise<GraphDataMem | number> {
        
        const [val, namesStringMap, suggestionsObj] = await getMany([header + "_graph", "namesStringMap", "suggestionsObj"]);
        
        console.log("val: ", val);
        if (val && isGraphMemValuesValid(val.graphData, val.thresholds, thresholds, val.missingNodes, namesStringMap as INamesStringMap)) {
            console.log("loading graph data from memory");
            return {graphData: val.graphData as ICustomGraphData, missingNodes: val.missingNodes as Missing, alternatives: val.alternatives as [string, string][]};
        }
        
        console.log("getting graph data from server");
        const [values_arr, ids_arr] = await getMany([header + "_data", "proteinsNames"])
        const idsList: number[] = [];
        const stringNames: string[] = [];
        const proteins: string[] = [];
        const missing: Missing = [];
        const alternatives: [string, string][] = [];

        let values_map: { [key: string]: number } = {};
        for (let i = 0; i < values_arr.length; i++) {
            values_map[ids_arr[i]] = values_arr[i];
        }

        Object.entries(namesStringMap as INamesStringMap).forEach(([orgName, { stringName, stringId }]) => {
            const val = values_map[orgName];
            if (val > thresholds.pos || val < thresholds.neg) {
                if (stringId === NO_STRING_ID){
                    missing.push({orgName: orgName, value: val} as MissingItem);
                }
                else{
                    const suggestions: {[key: string]: number} = suggestionsObj.alternative_match[orgName];
                    if (suggestions && Object.keys(suggestions).includes(stringName)){
                        alternatives.push([orgName, stringName]);
                    }
                    idsList.push(stringId);
                    stringNames.push(stringName);
                    proteins.push(orgName);
                }
            }
        });

        if (idsList.length > MAX_NODES_PER_GRAPH && !ignoreMissing){
            console.log("too many nodes(" + idsList.length + ")");
            return idsList.length;
        }

        set(header + "_graph", {
            graphData: null,
            thresholds: {...thresholds} as threshMap,
            missingNodes: missing,
            alternatives: alternatives
        });

        const body = {
            values_map: values_map,
            thresh_pos: thresholds.pos,
            thresh_neg: thresholds.neg,
            score_thresh: scoreThreshold,
            proteins: proteins,
            ids: idsList,
            string_names: stringNames,
        };
        console.log("body", body);

        makePostRequest(JSON.stringify(body), "graphs", handleData, handleError);
        return {graphData: null, missingNodes: missing, alternatives: alternatives};
}

export const getMod = (name: string) => {
    const parts = name.split("_");
    return parts.length > 1 ? "_" + parts[parts.length - 1] : "";
}