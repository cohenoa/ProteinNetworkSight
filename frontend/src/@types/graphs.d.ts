import type { NodeObject, LinkObject, GraphData } from "react-force-graph-3d";

export interface ICustomNode extends NodeObject {
  id: string;
  string_name: string;
  info: string;
  color: string;
  size: number;
  drug: number[];
  links: string[];
  linksWeights: number;
}

interface drug {
  drugName: string;
  drugBankID: string;
}

export interface ICustomLink extends LinkObject {
  index?: number;
  score?: number;
  source?: any;
  target?: any;
}

export interface Drug_Info {
  drug_id: number,
  drug_name: string,
  EMA: boolean,
  FDA: boolean,
  EN: boolean,
  WHO: boolean,
  Generic: boolean,
  Year: integer,
  Other: string,
  DrugBank_ID: string,
  ChEMBL: string,
  ATC: string,
  Indications: string
  targets: string[]
}

export interface ICustomGraphData extends GraphData {
  nodes: ICustomNode[];
  links: ICustomLink[];
  drugs: {[key: number]: Drug_Info};
}

export interface ICustomAllGraphData {
  [key: string]: ICustomGraphData;
}

export interface IObjectNode {
  nodeCanvasObjectMode:
    | string
    | ((obj: NodeObject) => CanvasCustomRenderMode)
    | undefined;
  nodeCanvasObject: CanvasCustomRenderFn<NodeObject> | undefined;
  nodeThreeObjectExtend: NodeAccessor$1<boolean> | undefined;
}

export interface GraphDataMem {
  graphData: ICustomGraphData | null, 
  missingNodes: Missing, 
  alternatives: [string, string][]
}
