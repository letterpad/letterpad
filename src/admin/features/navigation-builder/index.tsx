import { Container, Grid } from "./Navigation.css";
import React, { useState } from "react";
import Section, { Title } from "../../components/section";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";
import { SortableContainer, arrayMove } from "react-sortable-hoc";
import { WithNamespaces, translate } from "react-i18next";

import { Button } from "../../components/button";
import { IMenu } from "../../../client/types";
import SortableItem from "./SortableItem";
import { UPDATE_OPTIONS } from "../../../shared/queries/Mutations";
import apolloClient from "../../../shared/apolloClient";
import { useNavigationData } from "./data.hook";

interface IMenuWithError extends IMenu {
  hasError?: boolean;
}
interface INavigationBuilderProps extends WithNamespaces {
  settings: { [option in SettingOptions]: Setting };
}

const Navigation: React.FC<INavigationBuilderProps> = ({ settings, t }) => {
  const { data, loading } = useNavigationData();
  const [menu, setMenu] = useState<IMenuWithError[]>([
    ...normalizeSlugs(JSON.parse(settings.menu.value)),
  ]);
  if (loading) return null;

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    const newOrder = arrayMove(menu, oldIndex, newIndex);
    setMenu(newOrder);
    await save(settings.menu.option, newOrder);
  };

  const addNewRow = () => {
    const newItem = {
      id: +new Date(),
      title: "",
      slug: "",
      type: "",
      originalName: "",
    };
    setMenu([...menu, newItem]);
  };

  const onChange = async (index: number, change: IMenuWithError) => {
    let newMenu = [...menu];
    newMenu[index] = change;
    setMenu(newMenu);

    await save(settings.menu.option, newMenu);
  };

  const onRemove = async index => {
    if (menu.length === 1) {
      return alert("Navigation menu cannot be empty");
    }
    const newMenu = [...menu];
    newMenu.splice(index, 1);
    setMenu(newMenu);
    await save(settings.menu.option, newMenu);
  };

  return (
    <Section
      title={<Title title={t("menu.title")} onClick={() => addNewRow()} />}
      subtitle={t("menu.tagline")}
    >
      <Container>
        <Grid>
          <span />
          <strong>Label</strong>
          <strong>Slug</strong>
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
      </Container>
    </Section>
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

function normalizeSlugs(menu) {
  return menu.map((item, idx) => {
    item.slug = item.slug
      .replace("/category/", "")
      .replace("/tag/", "")
      .replace("/posts/", "")
      .replace("/page/", "");
    item.id = idx;
    return item;
  });
}

function prepareForBackend(newMenu) {
  return newMenu.map(item => {
    delete item.hasError;
    delete item.id;
    return item;
  });
}

async function save(option, value) {
  const errors = value.filter(item => item.hasError);
  if (errors.length > 0) {
    return;
  }
  const cleanMenu = prepareForBackend(value);

  await apolloClient(true).mutate({
    mutation: UPDATE_OPTIONS,
    variables: {
      options: [
        {
          option: option,
          value: JSON.stringify(cleanMenu),
        },
      ],
    },
  });
}
