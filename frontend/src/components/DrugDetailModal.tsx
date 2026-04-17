// import { FC, useEffect, useRef, useState } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { SortChangedEvent ,GridReadyEvent, ColDef } from 'ag-grid-community';
// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-alpine.css";
// import "../styles/Table.css";
// import { Drug_Info } from "../@types/graphs";
// import { useStateMachine } from "little-state-machine";
// import { updateSortTable } from "../common/UpdateActions";

import { FC, useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { GridReadyEvent, ColDef } from 'ag-grid-community';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "../styles/Table.css";
import { Drug_Info } from "../@types/graphs";

interface ColumnConfig {
  value: (drug: Drug_Info) => any;
  type: "string" | "number" | "boolean";
  explanation: string;
  flex: number;
  cellRenderer?: string;
}

const columns: { [key: string]: ColumnConfig } = {
  "Drug Name": {
    value: (drug: Drug_Info) => String(drug.drug_name),
    type: "number",
    explanation: "The official of the drug",
    flex: 1
  },
  "Drug Bank ID": {
    value: (drug: Drug_Info) => String(drug.DrugBank_ID),
    type: "string",
    explanation: "The ID of the drug in DrugBank",
    flex: 1
  },
  "ChEMBL ID": {
    value: (drug: Drug_Info) => String(drug.ChEMBL),
    type: "string",
    explanation: "The ID of the drug in ChEMBL",
    flex: 1
  },
  "ATC code": {
    value: (drug: Drug_Info) => String(drug.ATC),
    type: "string",
    explanation: "The ATC code of the drug",
    flex: 1
  },
  "EMA": {
    value: (drug: Drug_Info) => String(drug.EMA),
    type: "boolean",
    explanation: "Approved by EMA",
    flex: 1
  },
  "FDA": {
    value: (drug: Drug_Info) => String(drug.FDA),
    type: "boolean",
    explanation: "Approved by FDA",
    flex: 1
  },
  "EN": {
    value: (drug: Drug_Info) => String(drug.EN),
    type: "boolean",
    explanation: "Approved by EN",
    flex: 1
  },
  "WHO": {
    value: (drug: Drug_Info) => String(drug.WHO),
    type: "boolean",
    explanation: "Approved by WHO",
    flex: 1
  },
  "Generic": {
    value: (drug: Drug_Info) => String(drug.Generic),
    type: "boolean",
    explanation: "Generic",
    flex: 1
  },
  "Year": {
    value: (drug: Drug_Info) => String(drug.Year),
    type: "number",
    explanation: "Year of approval",
    flex: 1
  },
  "Indications": {
    value: (drug: Drug_Info) => String(drug.Indications),
    type: "string",
    explanation: "The indication of the drug",
    flex: 0.1
  },
//   Generic: boolean,
//   Other: string,
};

// type columnsKey = keyof typeof columns;
// type row = {
//   [K in columnsKey]: typeof columns[K]["type"];
// };

// const DrugDetailModal: FC<{data: Drug_Info[]}> = ({ data }) => {
//     const { state, actions } = useStateMachine({updateSortTable});
//     const [rowData, setRowData] = useState<row[]>([]);
//     const initialExplanation = "click on a cell to read information about it"
//     const [explanation, setExplanation] = useState(initialExplanation)
//     const gridRef = useRef<AgGridReact>(null);
//     const [columnDefs] = useState<ColDef[]>(
//         Object.entries(columns).map(([key, col]) => ({
//         field: key,
//         // cellRenderer: col.cellRenderer,
//         wrapText: true,        // REQUIRED
//         autoHeight: true,      // REQUIRED
//         }))
//     );

//     const updateExplanationText = (cellColumn?:string)=>{
//         const cellColumnKey = cellColumn as columnsKey;
//         if (cellColumnKey && columns[cellColumnKey]) {
//         setExplanation(columns[cellColumnKey].explanation);
//         } else {
//         setExplanation(initialExplanation);
//         }
//     }

//     function buildRow(drug: any): row {
//         return Object.fromEntries(
//         Object.entries(columns).map(([key, col]) => [
//             key,
//             col.value(drug),
//         ])
//         ) as row;
//     }

//     useEffect(() => {
//         const rows = data.map(buildRow);
//         setRowData(rows);
//     }, [data]);

//     //   useEffect(() => {
//     //     data.forEach((drug) => {
//     //       const row = buildRow(drug);
//     //       console.log(row);
//     //       setRowData((prev) => [...prev, row]);
//     //     });
//     //   }, [data]);

//     const defaultColDef = {
//         sortable: true,
//     };


//     const onSortChanged = (e: SortChangedEvent) => {
//         if(e.columnApi){

//         const sortState = e.columnApi.getColumnState()
//         console.log(sortState);
//         if(sortState !== undefined)
//             actions.updateSortTable({ sortTable: sortState });
//         }
//     }
//     const onGridReady = (e: GridReadyEvent) => {
//         console.log("onGridReady\n");
//         e.columnApi.applyColumnState({state : state.sortTable});
//         e.api.sizeColumnsToFit();
//     };

//     console.log("rowData",rowData);
//     console.log("state.sortTable", state.sortTable);
//     console.log("columnDefs", columnDefs);

//     console.log(Object.keys(rowData[0] || {}));
//     console.log(columnDefs.map(c => c.field));

//     return (
//         <div className="drug-detail-modal ag-theme-alpine table-container">
//             {/* <div className="Top-Table-Components">
//                 <div className="DownloadBtnContainer">
//                 <button 
//                     className="btn btn--outline" 
//                     onClick={() => downloadTable()}>
//                     Download
//                 </button>
//                 </div>
//                 <div className="cell-explanation">
//                 {explanation}
//                 </div>
//             </div> */}
//             <AgGridReact
//                 ref={gridRef}
//                 defaultColDef={defaultColDef}
//                 rowData={rowData}
//                 columnDefs={columnDefs}
//                 onSortChanged={onSortChanged}
//                 onGridReady={onGridReady}
//                 onCellClicked={(event) => updateExplanationText(event.colDef.field)}
//                 enableBrowserTooltips={true}
//                 components={{
//                 twoLineCell: TwoLineCell,
//                 }}
//             />
//         </div>
//     );
// };


// const TwoLineCell = (props: any) => {
//   return (
//     <div
//       className="two-line-cell"
//       title={props.value}
//     >
//       {props.value}
//     </div>
//   );
// };

// import { FC, useEffect, useRef, useState } from "react";
// import { AgGridReact } from "ag-grid-react";
// import { GridReadyEvent, ColDef } from 'ag-grid-community';
// import "ag-grid-community/dist/styles/ag-grid.css";
// import "ag-grid-community/dist/styles/ag-theme-alpine.css";
// import "../styles/Table.css";
// import { Drug_Info } from "../@types/graphs";


// interface ColumnConfig {
//   value: (node: Drug_Info) => string | number;
//   type: "string" | "number";
//   explanation: string;
//   flex: number;
//   cellRenderer?: string;
// }

// const columns: { [key: string]: ColumnConfig } = {
//   "Original Name": {
//     value: (node: Drug_Info) => "ID",
//     type: "string",
//     explanation: "The original name from the file you uploaded",
//     flex: 1
//   },

//   "STRING Name": {
//     value: (node: Drug_Info) => "Name",
//     type: "string",
//     explanation: "The matched name on STRING-db",
//     flex: 1
//   },

// } as const;

type columnsKey = keyof typeof columns;
type row = {
  [K in columnsKey]: typeof columns[K]["type"] extends "number" ? number : string;
};

const DrugDetailModal: FC<{data: Drug_Info[] }> = ({ data }) => {
  const [rowData, setRowData] = useState<row[]>([]);
  const initialExplanation = "click on a cell to read information about it"
  const [explanation, setExplanation] = useState(initialExplanation)
  const gridRef = useRef<AgGridReact>(null);
  const [columnDefs] = useState<ColDef[]>(
    Object.entries(columns).map(([key, col]) => ({
      field: key,
      cellRenderer: col.cellRenderer,
      wrapText: true,        // REQUIRED
      autoHeight: key == "Indications" ? false : true,      // REQUIRED
    }))
  );

  const updateExplanationText = (cellColumn?:string)=>{
    const cellColumnKey = cellColumn as columnsKey;
    if (cellColumnKey && columns[cellColumnKey]) {
      setExplanation(columns[cellColumnKey].explanation);
    } else {
      setExplanation(initialExplanation);
    }
  }

  function buildRow(node: any): row {
    return Object.fromEntries(
      Object.entries(columns).map(([key, col]) => [
        key,
        col.value(node),
      ])
    ) as row;
}

  useEffect(() => {
    data.forEach((node) => {
      const row = buildRow(node);
      setRowData((prev) => [...prev, row]);
    });
  }, [data]);

  // enable sorting on all columns by default
  const defaultColDef = {
    sortable: true,
  };

  const onGridReady = (e: GridReadyEvent) => {
    console.log("onGridReady\n");
    // e.columnApi.applyColumnState({state : state.sortTable});
    e.api.sizeColumnsToFit();
  };

  return (
    <div className="ag-theme-alpine table-container drug-detail-modal">
      {/* <div className="Top-Table-Components">
        <div className="DownloadBtnContainer">
          <button 
            className="btn btn--outline" 
            onClick={() => downloadTable()}>
              Download
          </button>
        </div>
        <div className="cell-explanation">
          {explanation}
        </div>
      </div> */}
      <AgGridReact
        ref={gridRef}
        defaultColDef={defaultColDef}
        rowData={rowData}
        columnDefs={columnDefs}
        // onSortChanged={onSortChanged}
        onGridReady={onGridReady}
        onCellClicked={(event) => updateExplanationText(event.colDef.field)}
        enableBrowserTooltips={true}
        components={{
          twoLineCell: TwoLineCell,
        }}
      />
    </div>
  );
};

const TwoLineCell = (props: any) => {
  return (
    <div
      className="two-line-cell"
      title={props.value}
    >
      {props.value}
    </div>
  );
};


export default DrugDetailModal;
