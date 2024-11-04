import React from "react";

interface DynamicTableProps<T> {
  data: T[];
  headers: string[];
  renderRow: (item: T, index: number) => React.ReactNode;
}

const DynamicTable = <T,>({
  data,
  headers,
  renderRow,
}: DynamicTableProps<T>) => {
  return (
    <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
      <thead className="bg-gray-800 text-white">
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="px-4 py-2 text-left text-sm font-medium tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item, index) => renderRow(item, index))}</tbody>
    </table>
  );
};

export default DynamicTable;
