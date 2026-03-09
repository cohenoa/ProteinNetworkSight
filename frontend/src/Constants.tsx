import { threshMap } from "./@types/global";

export const MAX_LINES_PER_FILE = 5000;
export const MAX_NODES_PER_GRAPH = 500;

export const NO_STRING_ID = -1;
export const NO_STRING_NAME = "other";

export const defaultThresholds: threshMap = {pos: 0.08, neg: -0.08};
export const defaultScoreThrehold: number = 0.4

export const SAVED_STRING_NAME_TITLE = "STRING Name";
export const SAVED_STRING_ID_TITLE = "STRING ID";
export const SAVED_STRING_SCORE_THRESHOLD_TITLE = "STRING Score Threshold";
export const SAVED_ORGANISM_TITLE = "Organism";
export const SAVED_NUMERIC_COLUMN_PREFIX_TITLE = "Numeric Column Prefix";
export const SAVED_NAMES_COLUMN_TITLE = "Names Column";

export const SAVED_POS_THRESHOLD_TITLE = "Positive Threshold";
export const SAVED_NEG_THRESHOLD_TITLE = "Negative Threshold";