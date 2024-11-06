import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import GetAppIcon from "@mui/icons-material/GetApp";

interface ExcelExportProps {
  data: any;
  fileName: string;
}

const ExcelExport = ({ data, fileName }: ExcelExportProps) => {
  const headers = [
    "Robot Name",
    "Robot Id",
    "Task Id",
    "Given By",
    "Task Code",
    "Task Name",
    "Task Percentage",
    "Task Priority",
    "Task Start Time",
    "Task Finish Time",
    "Task Details",
  ];

  const formattedData = data.map((item: any) => {
    return {
      "Robot Name": item.robotName || "",
      "Robot Id": item.robotId || "",
      "Task Id": item.Task?.taskId || "",
      "Given By": item.userName || "",
      "Task Code": item.Task?.taskCode || "",
      "Task Name": item.Task?.taskName || "",
      "Task Percentage": item.Task?.taskPercentage || "",
      "Task Priority": item.Task?.taskPriority || "",

      "Task Start Time": item.taskStartTime || "",
      "Task Finish Time": item.taskEndTime || "",

      "Task Details": item.Targets
        ? item.Targets.map(
            (target: any) =>
              `Location: ${target.locationName || "N/A"}, Executed: ${
                target.targetExecuted
              }`
          ).join(" => ")
        : "",
    };
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(formattedData, {
      header: headers,
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <button
      className="w-fit bg-transparent flex flex-row items-center gap-2"
      onClick={exportToExcel}
    >
      Export to Excel
      <GetAppIcon />
    </button>
  );
};

export default ExcelExport;
