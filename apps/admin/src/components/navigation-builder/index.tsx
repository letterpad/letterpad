import { Navigation as NavigationItemType } from "graphql-letterpad";
import React, { useCallback, useMemo } from "react";

import { List } from "@/components/navigation-builder/sortable";

import { useNavigationData } from "./data.hook";

import { INavigationBuilderProps } from "@/types";

const Navigation: React.FC<INavigationBuilderProps> = ({
  menuData,
  updateOption,
}) => {
  const { collection } = useNavigationData();

  const menu = useMemo(() => {
    return [...addIds(menuData)];
  }, [menuData]);

  const onChange = useCallback(
    (data: NavigationItemType[]) => {
      updateOption(prepareForBackend(data));
    },
    [updateOption]
  );

  return (
    <>
      <List items={menu} suggestions={collection} onChange={onChange} />
    </>
  );
};

export default Navigation;

function prepareForBackend(newMenu: NavigationItemType[]) {
  return newMenu.map((item) => {
    const { label, slug, original_name, type } = item;
    return { label, slug, original_name, type };
  });
}

function addIds(arr: NavigationItemType[]) {
  return arr.map((item, idx) => {
    const slug = item.slug.split("/").pop() as string;
    const enhancedItem = { ...item, id: idx, slug };

    return enhancedItem;
  });
}
