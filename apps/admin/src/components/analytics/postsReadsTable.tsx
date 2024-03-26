import { ListPlaceholder } from "ui";

import { secondsToMinutes } from "../../app/api/analytics/helper";
import { ProcessedReportData } from "../../app/api/analytics/types";

export function PostsReadTable({
  data,
  loading,
}: {
  data: ProcessedReportData[];
  loading: boolean;
}) {
  if (loading) return <ListPlaceholder className="w-full" />;
  return (
    <div className="md:flex-none min-w-full sm:px-6 md:px-0 overflow-auto max-h-96 lg:max-h-96 relative">
      <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-200">
        <thead className="">
          <tr>
            <th className="sticky z-10 top-0 text-sm leading-6 font-semibold text-slate-700 bg-white p-0 dark:bg-slate-900 dark:text-slate-300">
              Page Path
            </th>
            <th className="sticky z-10 top-0 text-sm leading-6 font-semibold text-slate-700 bg-white p-0 dark:bg-slate-900 dark:text-slate-300">
              Sessions
            </th>
            <th className="sticky z-10 top-0 text-sm leading-6 font-semibold text-slate-700 bg-white p-0 dark:bg-slate-900 dark:text-slate-300">
              Reads
            </th>
            <th className="md:block hidden sticky z-10 top-0 text-sm leading-6 font-semibold text-slate-700 bg-white p-0 dark:bg-slate-900 dark:text-slate-300">
              Engagement Time
            </th>
          </tr>
        </thead>
        <tbody className="align-baseline">
          {data.map((item, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-800/50"
              }
            >
              <td className="py-2 px-4 font-mono font-medium text-xs leading-6 text-sky-500 dark:text-sky-400 text-ellipsis">
                <div className="whitespace-normal truncate overflow-hidden max-w-xs md:max-w-lg md:min-w-96">
                  {item.pagePath}
                </div>
              </td>
              <td className="px-4 py-2 border border-gray-200 dark:border-gray-800">
                {item.pageViews}
              </td>
              <td className="px-4 py-2 border border-gray-200 dark:border-gray-800">
                {item.reads}
              </td>
              <td className="md:block hidden  px-4 py-2 border border-gray-200 dark:border-gray-800">
                {secondsToMinutes(item.duration / item.pageViews)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
