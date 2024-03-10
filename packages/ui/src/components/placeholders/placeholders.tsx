"use client";

import classNames from "classnames";
import { FC } from "react";

import { Content } from "../content";
import { PageHeader } from "../page-header";

export const TextBlockPlaceholder = () => {
  return (
    <div role="status" className="w-full animate-pulse space-y-2.5">
      <div className="flex w-full items-center space-x-2">
        <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="flex w-full max-w-[480px] items-center space-x-2">
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="flex w-full items-center space-x-2">
        <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-3/5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="flex w-full items-center space-x-2">
        <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="flex w-full items-center space-x-2">
        <div className="h-2.5 w-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-3/5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <div className="flex w-full max-w-[360px] items-center space-x-2">
        <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="h-2.5 w-80 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2.5 w-full rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LinePlaceholder = () => {
  return (
    <div role="status" className=" animate-pulse ">
      <div className="mt-4 flex h-8 items-center justify-center gap-2">
        <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="w-18 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const PostTitlePlaceholder = () => {
  return (
    <div role="status" className=" animate-pulse ">
      <div className="flex h-10 items-center justify-center gap-2">
        <div className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-1/3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="flex h-10 items-center justify-center gap-2">
        <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="w-18 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-8 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const TablePlaceholder: FC<{
  loading?: boolean;
  className?: string;
}> = ({ loading = false, className }) => {
  return (
    <div
      className={`animate-pulse ${loading ? "block" : "hidden"} ${className}`}
    >
      <div className="mb-4 mt-3 h-6 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-4 h-6 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-4 h-6 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-4 h-6 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="mb-4 h-6 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  );
};

export const PagePlaceholder = () => {
  const TitlePlaceholder = (
    <div className="help-text w-40 animate-pulse">
      <div className="mb-4 mt-3 h-8 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );

  return (
    <>
      <PageHeader className="site-page-header" title={TitlePlaceholder}>
        <div className="help-text w-96 animate-pulse">
          <div className="mb-4 mt-3 h-4 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </PageHeader>
      <Content>
        <div>
          <TablePlaceholder loading={true} />
        </div>
      </Content>
    </>
  );
};


export const ListPlaceholder:FC<{className?: string}> = ({className}) => {
  return <div role="status" className={
    classNames("max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700", className)
  }>
      <div className="flex items-center justify-between">
          <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
      </div>
      <ListItem/>
      <ListItem/>
      <ListItem/>
      <ListItem/>
      <span className="sr-only">Loading...</span>
  </div>
  
}

const ListItem = () => (<div className="flex items-center justify-between pt-4">
<div>
    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
    <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
</div>
<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
</div>)


export const WidgetPlaceholder:FC<{className?: string}> = ({className}) => (
  <div role="status" className={classNames("max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700", className)}>
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
      <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      <div className="flex items-baseline mt-4">
          <div className="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
          <div className="w-full h-56 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
          <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
          <div className="w-full h-64 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
          <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
          <div className="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
          <div className="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
      </div>
      <span className="sr-only">Loading...</span>
  </div>
  )

export const MetricPlaceholder:FC<{className?: string}> = ({className}) => (
  <div
    role="status"
    className={classNames(
      "p-4 border border-gray-200 rounded shadow animate-pulse md:p-4 dark:border-gray-700",
      className
    )}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
    </div>
    <div className="flex flex-row gap-4">
      <div className="w-full bg-gray-200 rounded-lg h-8 dark:bg-gray-700"></div>
    </div>
    <div className="flex items-center justify-between mt-4">
      <div className="w-20 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);