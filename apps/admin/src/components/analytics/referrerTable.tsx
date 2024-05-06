import { ListPlaceholder } from "ui";

import { ProcessedReferralData } from "../../app/(protected)/api/analytics/types";

export function ReferrerTable({
  data,
  loading,
}: {
  data: ProcessedReferralData[];
  loading: boolean;
}) {
  if (loading) return <ListPlaceholder />;
  return (
    <div className="flex lg:justify-center">
      <div className="flex-auto md:px-0 relative overflow-auto max-h-96 lg:max-h-80">
        <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-200">
          <thead className="">
            <tr>
              <th className="sticky z-10 top-0 text-sm leading-6 font-semibold text-slate-700 bg-white p-0 dark:bg-slate-900 dark:text-slate-300">
                Referrer
              </th>
              <th className="sticky z-10 top-0 text-sm leading-6 font-semibold text-slate-700 bg-white p-0 dark:bg-slate-900 dark:text-slate-300">
                Sessions
              </th>
            </tr>
          </thead>
          <tbody className="align-baseline">
            {data?.map((item, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-800/50"
                }
              >
                <td className="py-2 px-4 font-mono font-medium text-xs leading-6 text-sky-500 whitespace-nowrap dark:text-sky-400">
                  <div className="whitespace-normal truncate overflow-hidden max-w-[200px] md:max-w-lg md:min-w-96">
                    {item.referrer}
                  </div>
                </td>
                <td className="px-4 py-2 border border-gray-200 dark:border-gray-800">
                  {item.sessions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
