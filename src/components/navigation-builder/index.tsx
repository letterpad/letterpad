import { Container, Grid } from "./Navigation.css";
import React, { useState } from "react";
import { arrayMove } from "react-sortable-hoc";
import { useNavigationData } from "./data.hook";
import {
  Navigation as NavigationItemType,
  NavigationType,
} from "@/__generated__/type-defs.graphqls";
import { Button } from "antd";
import SortableList from "./SortableList";
import { IMenuWithError, INavigationBuilderProps } from "shared/types";

const Navigation: React.FC<INavigationBuilderProps> = ({
  menuData,
  updateOption,
}) => {
  const { collection, loading } = useNavigationData();
  const [menu, setMenu] = useState<IMenuWithError[]>([...addIds(menuData)]);

  if (loading) return null;

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    const newOrder = arrayMove(menu, oldIndex, newIndex);
    setMenu(newOrder);
    updateOption(prepareForBackend(newOrder));
  };

  const generareId = () => {
    const ids = menu.map(item => item.id) as number[];
    const id = Math.max.apply(null, ids);

    return id + 1;
  };

  const addNewRow = () => {
    const newItem = {
      id: generareId(),
      label: "",
      slug: "",
      type: NavigationType.Custom,
      original_name: "",
    };
    setMenu([...menu, newItem]);
  };

  const onChange = async (index: number, change: IMenuWithError) => {
    let newMenu = [...menu];
    newMenu[index] = change;
    setMenu(newMenu);

    updateOption(prepareForBackend(newMenu));
  };

  const onRemove = async index => {
    if (menu.length === 1) {
      return alert("Navigation menu cannot be empty");
    }
    const newMenu = [...menu];
    newMenu.splice(index, 1);
    setMenu(newMenu);
    updateOption(prepareForBackend(newMenu));
  };

  return (
    <Container>
      <Grid>
        <span />
        <strong>Label</strong>
        <strong>Path</strong>
        <span />
      </Grid>
      <br />
      <div>
        <SortableList
          items={menu}
          onSortEnd={onSortEnd}
          source={collection}
          onChange={onChange}
          onRemove={onRemove}
          hideSortableGhost={false}
          lockAxis="y"
          lockToContainerEdges={true}
          pressThreshold={100}
          // shouldCancelStart={e => {
          //   //@ts-ignore
          //   return !e.target.classList.contains("dragger");
          // }}
        />
      </div>
      <Button size="small" type="primary" onClick={addNewRow}>
        New
      </Button>
    </Container>
  );
};

export default Navigation;

function prepareForBackend(newMenu: NavigationItemType[]) {
  return newMenu.map(item => {
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
