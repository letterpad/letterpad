import { timeAgo } from "../../lib/timeAgo";

export const NotificationItem = ({ link, avatar, time, message }) => {
  return (
    <a
      href={link}
      className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <div className="flex-shrink-0">
        <img
          className="rounded-full w-9 h-9 p-1 bg-slate-200 dark:bg-slate-700"
          src={avatar}
          alt="Image"
        />
      </div>
      <div className="w-full ps-3">
        <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
          {message}
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-500">
          {timeAgo(time)}
        </div>
      </div>
    </a>
  );
};
