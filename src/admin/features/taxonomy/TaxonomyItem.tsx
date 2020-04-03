import React, { useEffect, useState } from "react";

import { StyledCheckbox } from "../../components/checkbox/Checkbox.css";
import { Taxonomy } from "../../../__generated__/gqlTypes";
import styled from "styled-components";

interface IProps {
  taxonomy: Taxonomy;
  onUpdate: (item: Taxonomy) => void;
  onSelect: (id: number, checked: boolean) => void;
}
let timeout;
const TaxonomyItem: React.FC<IProps> = ({ taxonomy, onUpdate, onSelect }) => {
  const [name, setName] = useState<string>(taxonomy.name);
  const [desc, setDesc] = useState<string>(taxonomy.desc || "");

  const onNameChange = value => {
    setName(value);
    const updatedItem = { ...taxonomy, name: value };
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      onUpdate(updatedItem);
      clearTimeout(timeout);
    }, 800);
  };

  const onDescChange = value => {
    setDesc(value);
    const updatedItem = { ...taxonomy, desc: value };

    timeout = setTimeout(() => {
      onUpdate(updatedItem);
      clearTimeout(timeout);
    }, 800);
  };

  return (
    <article key={taxonomy.slug}>
      <StyledCheckbox>
        <input
          type="checkbox"
          id={"checkbox-" + taxonomy.id}
          onClick={(e: React.MouseEvent<HTMLInputElement>) =>
            onSelect(taxonomy.id, e.currentTarget.checked)
          }
        />
        <label htmlFor={"checkbox-" + taxonomy.id} />
      </StyledCheckbox>

      <div className="name">
        <div className="title">
          <InlineInput
            value={name}
            onChange={onNameChange}
            placeholder="Category name"
          />
        </div>
      </div>
      <div className={"upper description"}>
        <InlineInput
          value={desc}
          onChange={onDescChange}
          placeholder="Enter a description"
        />
      </div>
    </article>
  );
};

export default TaxonomyItem;

const InlineInput: React.FC<{
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}> = ({ value, onChange, placeholder }) => {
  return (
    <form>
      <Input
        type="text"
        autoComplete="off"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </form>
  );
};

const Input = styled.input`
  border: none;
  background: transparent;
  /* border-bottom: 1px solid #ddd; */
  width: 100%;
`;
