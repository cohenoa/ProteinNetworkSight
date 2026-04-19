import { FC, useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { GridReadyEvent, ColDef, ICellRendererParams } from 'ag-grid-community';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "../styles/Table.css";
import { Drug_Info } from "../@types/graphs";

// --- Expandable cell renderer for long text ---
const ExpandableCellRenderer: FC<ICellRendererParams> = ({ value }) => {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW_LENGTH = 100;

  if (!value || value.length <= PREVIEW_LENGTH) {
    return <span>{value}</span>;
  }

  return (
    <div style={{ whiteSpace: "normal", lineHeight: "1.4", padding: "4px 0" }}>
      <span>
        {expanded ? value : `${value.slice(0, PREVIEW_LENGTH)}…`}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((prev) => !prev);
        }}
        style={{
          marginLeft: 6,
          padding: "1px 6px",
          fontSize: "11px",
          cursor: "pointer",
          border: "1px solid #aaa",
          borderRadius: 3,
          background: "#f5f5f5",
          color: "#333",
          whiteSpace: "nowrap",
        }}
      >
        {expanded ? "Less" : "More"}
      </button>
    </div>
  );
};

const LinkCellRenderer: FC<ICellRendererParams> = ({ value, colDef }) => {
  const buildUrl: ((value: string) => string) | undefined =
    colDef?.cellRendererParams?.buildUrl;

  const url = buildUrl ? buildUrl(value) : null;

  if (!url) return <span>{value}</span>;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );
};
// ----------------------------------------------

interface ColumnConfig {
  value: (drug: Drug_Info) => any;
  type: "string" | "number" | "boolean";
  explanation: string;
  flex?: number;
  cellRenderer?: FC<ICellRendererParams>;
  maxWidth?: number;
  minWidth?: number;
  cellRendererParams?: { buildUrl?: (value: string) => string };
}

const booleanCellValue = (value: boolean) => (value ? "V" : "");

const columns: { [key: string]: ColumnConfig } = {
  "Drug Name": {
    value: (drug: Drug_Info) => String(drug.drug_name),
    type: "number",
    maxWidth: 250,
    explanation: "The name of the drug",
  },
  "Drug Bank ID": {
    value: (drug: Drug_Info) => String(drug.DrugBank_ID),
    type: "string",
    explanation: "The ID of the drug in DrugBank",
    cellRenderer: LinkCellRenderer,
    maxWidth: 120,
    cellRendererParams: {
      buildUrl: (value: string) => value != "None" ? `https://go.drugbank.com/drugs/${value}`: "",
    },
  },
  "ChEMBL ID": {
    value: (drug: Drug_Info) => String(drug.ChEMBL),
    type: "string",
    explanation: "The ID of the drug in ChEMBL",
    cellRenderer: LinkCellRenderer,
    maxWidth: 120,
    cellRendererParams: {
      buildUrl: (value: string) => value != "None" ? `https://www.ebi.ac.uk/chembl/compound_report_card/CHEMBL${value}` : "",
    },
  },
  "ATC code": {
    value: (drug: Drug_Info) => String(drug.ATC),
    type: "string",
    maxWidth: 130,
    explanation: "The ATC (Anatomical Therapeutic Chemical) code of the drug",
  },
  "EMA": {
    value: (drug: Drug_Info) => booleanCellValue(drug.EMA),
    type: "boolean",
    maxWidth: 90,
    explanation: "Approved by EMA",
  },
  "FDA": {
    value: (drug: Drug_Info) => booleanCellValue(drug.FDA),
    type: "boolean",
    maxWidth: 90,
    explanation: "Approved by FDA",
  },
  "EN": {
    value: (drug: Drug_Info) => booleanCellValue(drug.EN),
    type: "boolean",
    maxWidth: 90,
    explanation: "Approved by EN (Euro Nationally)",
  },
  "WHO": {
    value: (drug: Drug_Info) => booleanCellValue(drug.WHO),
    type: "boolean",
    maxWidth: 90,
    explanation: "Approved by WHO",
    
  },
  "Year": {
    value: (drug: Drug_Info) => drug.Year == 0 ? "" : String(drug.Year),
    type: "number",
    maxWidth: 100,
    explanation: "Year of approval",
  },
  "Targets in Network": {
    value: (drug: Drug_Info) => String(drug.targets.join(", ")),
    type: "string",
    flex: 1,
    cellRenderer: ExpandableCellRenderer,
    minWidth: 200,
    explanation: "The drug also targets these nodes in the network",
  },
  "Indications": {
    value: (drug: Drug_Info) => String(drug.Indications),
    type: "string",
    explanation: "The indications of the drug",
    flex: 1,
    minWidth: 300,
    cellRenderer: ExpandableCellRenderer,
  },
};

type columnsKey = keyof typeof columns;
type row = {
  [K in columnsKey]: typeof columns[K]["type"] extends "number" ? number : string;
};

const DrugDetailModal: FC<{ data: Drug_Info[], main_target: string, exitModal: () => void }> = ({ data, main_target, exitModal }) => {
  const [rowData, setRowData] = useState<row[]>([]);
  const initialExplanation = "click on a cell to read information about it";
  const [explanation, setExplanation] = useState(initialExplanation);
  const gridRef = useRef<AgGridReact>(null);

  const [columnDefs] = useState<ColDef[]>(
    Object.entries(columns).map(([key, col]) => ({
      field: key,
      flex: col.flex,
      cellRenderer: col.cellRenderer,
      cellRendererParams: col.cellRendererParams,
      autoHeight: true,
      minWidth: col.minWidth,
      maxWidth: col.maxWidth,
      wrapText: key === "Indications" || key === "Targets in Network" ? true : undefined,
      cellStyle: {wordBreak: 'normal'}
    }))
  );

  const updateExplanationText = (cellColumn?: string) => {
    const cellColumnKey = cellColumn as columnsKey;
    if (cellColumnKey && columns[cellColumnKey]) {
      setExplanation(columns[cellColumnKey].explanation);
    } else {
      setExplanation(initialExplanation);
    }
  };

  function buildRow(node: any): row {
    return Object.fromEntries(
      Object.entries(columns).map(([key, col]) => [key, col.value(node)])
    ) as row;
  }

  useEffect(() => {
    data.forEach((node) => {
      const row = buildRow(node);
      setRowData((prev) => [...prev, row]);
    });
  }, [data]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
  };

  const onGridReady = (e: GridReadyEvent) => {
    console.log("onGridReady\n");
    e.api.sizeColumnsToFit();
  };

  const downloadTable = () => {
    const columns_names: string[] = Object.keys(columns);
    const csv = columns_names.join(",") + "\n" + rowData.map((row) => {
      row["Targets in Network"] = "\"" + row["Targets in Network"] + "\"";
      return Object.values(row).join(",");
    }).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "drugs_targeting_" + main_target + ".csv";
    link.click();
  };

  return (
    <div className="ag-theme-alpine table-container drug-detail-modal">
      <div className="Top-Table-Components">
        <div className="DownloadBtnContainer">
          <button className="btn btn--outline" onClick={() => {downloadTable()}}>
            Download
          </button>
        </div>
        <div className="cell-explanation">{explanation}</div>
        <button className="btn btn--close" onClick={() => {exitModal()}}><i className="fa fa-times"></i></button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <AgGridReact
        ref={gridRef}
        defaultColDef={defaultColDef}
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={onGridReady}
        onCellClicked={(event) => updateExplanationText(event.colDef.field)}
        enableBrowserTooltips={true}
      />
      </div>
    </div>
  );
};

export default DrugDetailModal;
