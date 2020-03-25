import React, { useState } from "react";
import { Setting, SettingOptions } from "../../../__generated__/gqlTypes";
import { SortableContainer, arrayMove } from "react-sortable-hoc";
import { WithNamespaces, translate } from "react-i18next";

// import { Button } from "../compo/LoginView.css";
import { Container } from "./Navigation.css";
import { IMenu } from "../../../client/types";
import Section from "../../components/section";
import SortableItem from "./SortableItem";
import StyledButton from "../../components/button";
import { useNavigationData } from "./data.hook";

interface INavigationBuilderProps extends WithNamespaces {
  settings: { [option in SettingOptions]: Setting };
}

const Navigation: React.FC<INavigationBuilderProps> = ({ settings, t }) => {
  const { data, loading } = useNavigationData();
  const [menu, setMenu] = useState<IMenu[]>([
    ...JSON.parse(settings.menu.value),
  ]);
  if (loading) return null;

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newOrder = arrayMove(menu, oldIndex, newIndex);
    setMenu(newOrder);
  };

  const addNewRow = () => {
    const newItem = {
      id: 999 + menu.length,
      title: "",
      slug: "",
      type: "",
    };
    setMenu([...menu, newItem]);
  };

  const onChange = (index, change) => {
    const newMenu = [...menu];
    newMenu[index] = change;
    console.log("can be saved");
    setMenu(newMenu);
  };

  const onRemove = index => {
    if (menu.length === 1) {
      return alert("Navigation menu cannot be empty");
    }
    menu.splice(index, 1);
    setMenu(menu);
  };

  return (
    <Section title={t("menu.title")} subtitle={t("menu.tagline")}>
      <Container>
        <div className="toolbar">
          <StyledButton onClick={addNewRow} success>
            Add
          </StyledButton>
        </div>
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
  return menu.map(item => {
    item.slug = item.slug
      .replace("/category/", "")
      .replace("/tag/", "")
      .replace("/posts/", "")
      .replace("/page/", "");
    return item;
  });
}
