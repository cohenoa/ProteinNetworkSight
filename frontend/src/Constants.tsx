import { threshMap } from "./@types/global";

export const MAX_LINES_PER_FILE = 5000;
export const MAX_NODES_PER_GRAPH = 500;

export const NO_STRING_ID = -1;
export const NO_STRING_NAME = "other";

export const defaultThresholds: threshMap = {pos: 0.08, neg: -0.08};