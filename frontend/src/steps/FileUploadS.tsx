import { useStateMachine } from "little-state-machine";
import { FC, FormEvent, useEffect, useState } from "react";
import { read, utils } from "xlsx";
import { IStepProps } from "../@types/props";
import { updateFileUpload, updateFileName, updateIsLoading, updatestringNames, updateNamesMap, updateThresholds, updateFileDetails, updateSavedFileUpload } from "../common/UpdateActions";
import { clearAction } from "../common/ClearAction";
import "../styles/FileUpload.css";
import { getExampleFile } from "../common/ExampleFileAction";
import { set, setMany, clear } from "idb-keyval";
import { INamesStringMap, threshMap } from "../@types/global";

import { defaultThresholds, MAX_LINES_PER_FILE, NO_STRING_ID, NO_STRING_NAME, SAVED_NAMES_COLUMN_TITLE, SAVED_NEG_THRESHOLD_TITLE, SAVED_NUMERIC_COLUMN_PREFIX_TITLE, SAVED_ORGANISM_TITLE, SAVED_POS_THRESHOLD_TITLE, SAVED_STRING_ID_TITLE, SAVED_STRING_NAME_TITLE, SAVED_STRING_SCORE_THRESHOLD_TITLE } from "../Constants";
import { OptionType } from "../@types/json";

const FileUploadStep: FC<IStepProps> = ({ step, goNextStep }) => {
  const { state, actions } = useStateMachine({
    updateFileName,
    updateFileUpload,
    updateSavedFileUpload,
    clearAction,
    updateIsLoading,
    updatestringNames,
    updateNamesMap,
    updateThresholds
  });

  const [file, setFile] = useState<File | null>(null);
  const [hasError, setHasError] = useState<string | null>(null);
  const [hasWarning, setHasWarning] = useState<string | null>(null);
  const [isExampleFile, setIsExampleFile] = useState(false);

  useEffect(() => {
    actions.clearAction();
    clear();
  }, []);

  useEffect(() => {
    if (state.fileName.length === 0){
      setFile(null);
      setIsExampleFile(false);
    };
  }, [state.fileName]);

  const onFileDrop = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const uploadedFile = event.target.files[0];

    setFile(uploadedFile);
    actions.updateFileName({ fileName: uploadedFile.name });
    setHasError(null);
    setHasWarning(null);
    setIsExampleFile(false);
  };

  const useExampleFile = () => {
    actions.clearAction();
    clear();
    actions.updateFileName({ fileName: "example_data.xlsx" });
    setIsExampleFile(true);
    setHasError(null);
    setHasWarning(null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isExampleFile) {
      console.log("using example file");
      const {json, headers} = getExampleFile();
      actions.updateFileUpload({headers: headers});
      set("json", json).then(() => {
        goNextStep();
      })
      .catch(error => {
        console.log(error);
        setHasError("Failed to load example file.");
      });
      return;
    }

    if (!file) {
      setHasError("No file selected.");
      return;
    }

    const fileType = file.name.split(".").pop()?.toLowerCase();
    if (!fileType || !["xlsx", "csv", "tsv"].includes(fileType)) {
      setHasError("Invalid file format. Please upload an XLSX, CSV or TSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setHasError("Error reading file.");

    reader.onload = async (e) => {
      if (!e.target?.result) {
        setHasError("Failed to load file.");
        return;
      }

      let pass: boolean = false;
      if (fileType === "xlsx") {
        pass = await processXLSXFile(e.target.result as ArrayBuffer);
      } 
      else if (fileType === "csv") {
        pass = await processCSVFile(e.target.result as string);
      }
      else if (fileType === "tsv"){
        pass = await processTSVFile(e.target.result as string);
      }
      console.log("pass", pass);
      if (!pass) return;
      goNextStep();
    };

    if (fileType === "xlsx") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const processXLSXFile = async (data: ArrayBuffer) => {
    const workbook = read(new Uint8Array(data), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const fileData = utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    const threholdsSheetName = workbook.SheetNames[1];
    const thresholdsWorksheet = workbook.Sheets[threholdsSheetName];
    const thresholdsFileData = utils.sheet_to_json(thresholdsWorksheet, { header: 1 }) as any[][];

    const metaDataSheetName = workbook.SheetNames[2];
    const metaDataWorksheet = workbook.Sheets[metaDataSheetName];
    const metaDataFileData = utils.sheet_to_json(metaDataWorksheet, { header: 1 }) as any[][];

    if (!await processParsedData(fileData)) return false;
    processMetaDataData(metaDataFileData, thresholdsFileData);
    return true;
  };

  const processCSVFile = async (data: string) => {
    const fileData = data.split("\n").map(row => row.split(","));
    return await processParsedData(fileData)? true : false;
  };

  const processTSVFile = async (data: string) => {
    const fileData = data.split("\n").map(row => row.split("\t"));
    return await processParsedData(fileData)? true : false;
  };

  const processParsedData = async (fileData: any[][]) => {
    const { filtered_data, num_invalid, num_duplicates} = filterInvalidAndDuplicatData(fileData);
    fileData = filtered_data;
    
    console.log("length check");
    console.log(fileData.length);
    if (fileData.length > MAX_LINES_PER_FILE) {
      setHasError(`File exceeds ${MAX_LINES_PER_FILE} rows. Please split it.`);
      return false;
    }

    console.log("header check");
    const headers = fileData.shift() as string[];
    if (!headers || headers.length < 2) {
      setHasError("Invalid file structure: must have at least two columns.");
      return false;
    }

    console.log("warning check");
    if (num_duplicates > 0 || num_invalid > 0) {
      let warning_string = "";
      if (num_invalid > 0){
        warning_string += `File contains ${num_invalid} invalid rows. these rows will not be used.\n`
      }
      if (num_duplicates > 0){
        warning_string += `File contains ${num_duplicates} duplicate entries. Only the first occurrence will be used.\n`
      }
      warning_string += "click next again to continue.";
      if (!hasWarning){
        setHasWarning(warning_string);
        return false;
      }
    }

    if (headers.includes(SAVED_STRING_NAME_TITLE) && headers.includes(SAVED_STRING_ID_TITLE)) {
      await processSavedFile(fileData, headers);
    } else {
      await uploadFileData(fileData, headers);
    }
    return true;
  };

  const processMetaDataData = (metaDataFileData: any[][], thresholdsFileData: any[][]) => {
    try{
      let scoreThrehold: number = state.scoreThreshold;
      let organism: OptionType = state.organism;
      let numericalColumnPrefix: string = state.vectorsPrefix;
      let namesColumn: string = state.idHeader;
      metaDataFileData.forEach(row => {
        if (row[0] == SAVED_STRING_SCORE_THRESHOLD_TITLE){
          scoreThrehold = Number(row[1]);
        }
        if (row[0] == SAVED_ORGANISM_TITLE){
          organism = {label: row[1], value: Number(row[2])};
        }
        if (row[0] == SAVED_NUMERIC_COLUMN_PREFIX_TITLE){
          numericalColumnPrefix = row[1];
        }
        if (row[0] == SAVED_NAMES_COLUMN_TITLE){
          namesColumn = row[1];
        }
      })    
      
      const headerRow = thresholdsFileData[0].filter((header) => header !== namesColumn && String(header).startsWith(numericalColumnPrefix));
      if (headerRow.length === 0){
        throw new Error("No numerical columns found.");
      }
      const thresholds: { [key: string]: threshMap } = Object.fromEntries(
        headerRow.map((header: any) => [header, {...defaultThresholds}])
      );
      console.log(thresholds);
      thresholdsFileData.forEach(row => {
        if (row[0] === SAVED_POS_THRESHOLD_TITLE){
          for (let i = 0; i < headerRow.length; i++){
            thresholds[headerRow[i]].pos = Number(row[i + 1]);
          }
        }
        if (row[0] === SAVED_NEG_THRESHOLD_TITLE){
          for (let i = 0; i < headerRow.length; i++){
            thresholds[headerRow[i]].neg = Number(row[i + 1]);
          }
        }
      });

      actions.updateSavedFileUpload({scoreThreshold: scoreThrehold, organism: organism, vectorsHeaders: headerRow, thresholds: thresholds, idHeader: namesColumn, vectorsPrefix: numericalColumnPrefix});
      return true;
    }
    catch(e){
      console.log(e);
      return false;
    }
  }

  function filterInvalidAndDuplicatData(data: any[][]): { filtered_data: any[][], num_invalid: number, num_duplicates: number } {
    const seen = new Set<string>();
    let num_invalid = 0;
    let num_duplicates = 0;

    const filtered_data = data.filter(row => {
      const key = row[0];
      if (key === undefined || key === null || key === "" || typeof key !== 'string') {
        num_invalid++;
        return false;
      };
      if (seen.has(key)) {
        console.log("Duplicate key: " + key);
        num_duplicates++;
        return false;
      }
      seen.add(key);
      return true;
    })

    console.log("num duplicates: " + num_duplicates);
    console.log("num invalid: " + num_invalid);

    return { filtered_data, num_invalid, num_duplicates };
  }

  const processSavedFile = async (fileData: any[][], headers: string[]) => {
    console.log("loading saved file");
    const namesStringMap: INamesStringMap = {};
    
    fileData.forEach(row => {
      if (row[1]) {
        namesStringMap[row[0]] = { stringId: row[2], stringName: row[1] };
      } else {
        namesStringMap[row[0]] = { stringId: NO_STRING_ID, stringName: NO_STRING_NAME };
      }
      row.splice(1, 2);
    });

    headers = headers.filter(h => h !== SAVED_STRING_ID_TITLE && h !== SAVED_STRING_NAME_TITLE);
    actions.updateFileUpload({headers: headers});
    await setMany([
      ["json", fileData],
      ["namesStringMap", namesStringMap]
    ])
  };

  const uploadFileData = async (fileData: any[][], headers: string[]) => {
    if (!fileData.length) {
      setHasError("File is empty or invalid.");
      return;
    }
    actions.updateFileUpload({headers: headers});
    await set("json", fileData);
  };

  return (
    <form className="upload-form" id={"form" + step} onSubmit={onSubmit}>
      <div className="upload-wrap">
        {state.fileName.length !== 0 ? (
          <h1 className="checked-prompt">
            <i className="fa fa-check" aria-hidden="true"></i>
            {state.fileName}
          </h1>
        ) : (
          <div className="drop-prompt">
            <i className="fa fa-plus" />
            <h1>
              Drop your file here <br /> or <span>browse</span>
            </h1>
            <button
              onClick={useExampleFile}
              className="use-example example-button"
            >
              use example file
            </button>
          </div>
        )}
        <input className="upload-container" type="file" onChange={onFileDrop} />
        {hasError  && (
          <p className="detail-error">{hasError}</p>
        )}
        {hasWarning && (
          <p className="detail-warning">{hasWarning}</p>
        )}
      </div>
    </form>
  );
};

export default FileUploadStep;