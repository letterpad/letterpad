import { Container, Grid } from "./navigation/Navigation.css";
import React, { useState } from "react";
import { Navigation, NavigationType } from "../../../__generated__/gqlTypes";
import { SortableContainer, arrayMove } from "react-sortable-hoc";
import { WithNamespaces, translate } from "react-i18next";

import { Button } from "../../components/button";

import SortableItem from "./navigation/SortableItem";
import { useNavigationData } from "./navigation/data.hook";
import { UpdateSettingOption } from "../../../types/types";

interface IMenuWithError extends Navigation {
  hasError?: boolean;
  id: number;
}
interface INavigationBuilderProps extends WithNamespaces {
  menuData: Navigation[];
  updateOption: (setting: UpdateSettingOption) => void;
}

const Navigation: React.FC<INavigationBuilderProps> = ({
  t,
  menuData,
  updateOption,
}) => {
  const { data, loading } = useNavigationData();
  const [menu, setMenu] = useState<IMenuWithError[]>([...addIds(menuData)]);

  if (loading) return null;

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    const newOrder = arrayMove(menu, oldIndex, newIndex);
    setMenu(newOrder);
    await updateOption({ menu: prepareForBackend(newOrder) });
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

    await updateOption({ menu: prepareForBackend(newMenu) });
  };

  const onRemove = async index => {
    if (menu.length === 1) {
      return alert("Navigation menu cannot be empty");
    }
    const newMenu = [...menu];
    newMenu.splice(index, 1);
    setMenu(newMenu);
    await updateOption({ menu: prepareForBackend(newMenu) });
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
          source={data}
          onChange={onChange}
          onRemove={onRemove}
          hideSortableGhost={false}
          lockAxis="y"
          lockToContainerEdges={true}
          shouldCancelStart={e => {
            //@ts-ignore
            return !e.target.classList.contains("dragger");
          }}
        />
      </div>
      <Button btnSize="md" btnStyle="primary" onClick={addNewRow}>
        New
      </Button>
    </Container>
  );
};

export default translate("translations")(Navigation);

const SortableList = SortableContainer(
  ({ items, source, onChange, onRemove }) => {
    return (
      <div>
        {items.map((value, index) => (
          <SortableItem
            key={value.id}
            index={index}
            value={value}
            source={source}
            onChange={change => onChange(index, change)}
            onRemove={e => {
              e.preventDefault();
              onRemove(index);
            }}
          />
        ))}
      </div>
    );
  },
);

function prepareForBackend(newMenu) {
  return newMenu.map(item => {
    const { label, slug, original_name, type } = item;
    return { label, slug, original_name, type };
  });
}

function addIds(arr) {
  return arr.map((item, idx) => {
    item.id = idx;
    item.slug = item.slug.split("/").pop();
    return item;
  });
}
