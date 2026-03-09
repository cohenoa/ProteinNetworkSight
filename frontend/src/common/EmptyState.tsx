import { ColumnState} from "ag-grid-community";
import { GlobalState } from "little-state-machine";
import { defaultScoreThrehold } from "../Constants";

export const emptyState: GlobalState = {
  fileName: "",
  idHeader: "UID",
  vectorsPrefix: "G",
  headers: [],
  organism: { label: "Homo sapiens", value: "9606" },
  scoreThreshold: defaultScoreThrehold,
  isSetSuggestions: false,
  vectorsHeaders: [],
  vectorsLastLayout: [],
  isLoading: false,
  isSetNamesMap: false,
  showError: false,
  thresholds:{},
  tooManyModal:{},
  sortTable: Array<ColumnState>(),
};
