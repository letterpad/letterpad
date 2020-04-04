import React, { useEffect, useState } from "react";

import { StyledCheckbox } from "../../components/checkbox/Checkbox.css";
import { Taxonomy } from "../../../__generated__/gqlTypes";
import styled from "styled-components";

interface IProps {
  taxonomy: Taxonomy;
  onUpdate: (item: Taxonomy) => void;
  onSelect: (id: number, checked: boolean) => void;
}

const TaxonomyItem: React.FC<IProps> = ({ taxonomy, onUpdate, onSelect }) => {
  const [name, setName] = useState<string>(taxonomy.name);
  const [desc, setDesc] = useState<string>(taxonomy.desc || "");

  const onNameChange = value => {
    setName(value);
  };

  const onDescChange = value => {
    setDesc(value);
  };

  const onBlur = (value, key) => {
    if (value.length === 0) return;
    const updatedItem = { ...taxonomy, [key]: value };
    onUpdate(updatedItem);
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
            onBlur={e => onBlur(name, "name")}
          />
        </div>
      </div>
      <div className={"upper description"}>
        <InlineInput
          value={desc}
          onChange={onDescChange}
          placeholder="Enter a description"
          onBlur={e => onBlur(name, "desc")}
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
  onBlur: (value: string) => void;
}> = ({ value, onChange, placeholder, onBlur }) => {
  return (
    <form>
      <Input
        type="text"
        autoComplete="off"
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={e => onBlur(e.target.value)}
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
  color: var(--color-base);
`;
