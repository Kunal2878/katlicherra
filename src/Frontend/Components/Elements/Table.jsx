import React from "react";
import { Trash2, PenSquare, Info } from "lucide-react";

const Table = ({
  columns,
  data,
  checkboxSelection = false,
  actions = false,
  customRowRender,
  onEdit,
  onDelete,
  extraClasses = "",
}) => {
  return (
    <div className={`overflow-x-auto text-black-300 text-base ${extraClasses}`}>
      <table className="w-full min-w-[768px] pb-10">
        <thead>
          <tr className="border-b bg-lamaPurpleLight">
            {checkboxSelection ? (
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  className="rounded h-4 w-4 bg-white border-gray-300 text-purpleColor checked:bg-purple-500 checked:border-transparent"
                />
              </th>
            ) : (
              <th className="px-6 py-4 text-left">SL No.</th>
            )}
            {columns?.map((column) => (
              <th key={column.field} className="px-6 py-4 text-left">
                {column.headerName}
                {
                  column.note && (
                    <div className="relative group inline-block">
                      <Info className="inline-block ml-1 cursor-help" size={14}/>
                      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded p-2 z-10 -left-1/2 transform -translate-x-1/2 bottom-full mb-1 min-w-[300px]">
                        {column.note}
                      </div>
                    </div>
                  )                }
              </th>
            ))}
            {actions && <th className="px-6 py-4 text-left">Action</th>}
          </tr>
        </thead>
        <tbody>
          {data?.length>0 && data?.map((row, index) => {
            if (customRowRender) {
              return customRowRender(row, index);
            }
            
            return (
              <tr
                key={row.id || index}
                className="border-b hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
              >
                {checkboxSelection ? (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded h-4 w-4 bg-white checked:border-transparent"
                    />
                  </td>
                ) : (
                  <td className="px-6 py-4 text-left">{index + 1}</td>
                )}
                {columns?.map((column) => (
                  <td key={`${row.id}-${column.field}`} className="text-left px-6 py-4">
                    {column.renderCell
                      ? column.renderCell(row)
                      : row[column.field] || "-"}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4">
                    <div className="flex justify-start gap-2">
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(row)} 
                          className="p-1 hover:text-danger transition-colors duration-200 transform hover:scale-110"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(row)} 
                          className="p-1 hover:text-purpleColor transition-colors duration-200 transform hover:scale-110"
                        >
                          <PenSquare size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;