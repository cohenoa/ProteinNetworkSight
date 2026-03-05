import { Font } from "three/examples/jsm/loaders/FontLoader";
import { IOthers } from "./forms";
import { Missing, threshMap } from "./global";
import { SupportedLayout, SupportedNodeColor, SupportedNodeSize, SupportedOpacity } from "../common/GraphSettings";
import { ICustomNode } from "./graphs";
/*
  This file define all the props interface - the argument for components.
*/

export interface nameStatus {
  accepted: boolean,
}

export interface replaceNameStatus extends nameStatus {
  string_name: string,
  string_id: int,
}

export interface formRef {
  getFormData: () => Record<string, string>;
}

export type downloadFileTypes = 'svg' | 'png' | 'json';

interface GraphExposedMethods extends HTMLDivElement {
  fetchData: () => void,
  applyLayout: (name: SupportedLayout, animate: boolean) => void,
  applyNodeSize: (size: SupportedNodeSize) => void,
  applyOpacity: (op: SupportedOpacity) => void,
  applyNodeColor: (type: 'pos' | 'neg', color: SupportedNodeColor) => void
  getGraphBlob: (type: downloadFileTypes) => Blob | null,
  layoutRender: () => void
}

export interface graphRef extends React.RefObject<HTMLDivElement>{
  current: GraphExposedMethods | null;
}

// Interface for props of Father and ButtonComponent that includes formRef
export interface formRefProps {
  formRef: RefObject<formRef>;
}

export interface IErrorInputTextProps {
  orgName: string;
  stringName: string;
}

export interface IStepProps {
  step: number;
  goNextStep: () => void;
}

export interface IPanelProps {
  node: ICustomNode | null;
  organism: OptionType;
  onClickClose: () => void;
}

export interface IGraphProps {
  graphData: ICustomGraphData;
  clickedVector: string;
  alertLoading: () => void;
}

export interface IStepsBarProps {
  step: number;
}

export interface IButtonsProps{
  formId: string;
  buttons: IButtonConfig[];
}

export interface IVectorsButtonsProp {
  vectorsValues: string[];
  setClickedVector: React.Dispatch<React.SetStateAction<string>>;
  clickedVector: string;
}

export interface IGraphBarProps {
  openTable: boolean;
  setOpenTable: React.Dispatch<React.SetStateAction<boolean>>;
  nodesNum: number;
  linksNum: number;
  missingNodes: Missing;
  alternativeNames: [string, string][];
  thresholds: threshMap;
  setThresholds: React.Dispatch<React.SetStateAction<threshMap>>;
}

export interface ISwitchableProps {
  setNamesStringMap: React.Dispatch<React.SetStateAction<INamesStringMap | undefined>>;
  orgName: string;
  suggestions: { [key: string]: number };
  selected: string;
}

interface MenuItem {
  label: string;
  icon: IconProp;
  onClick?: () => void;
  submenu?: MenuItem[];
}

interface ContextMenuProps {
  position: { x: number; y: number };
  depth: number;
  items: MenuItem[];
}

interface nodePositions {
  [key: string]: position;
}

interface position {
  x: number,
  y: number,
}

interface IButtonConfig {
  label: string;
  type: "button" | "submit";
  className: string;
  onClick: () => void;
}


