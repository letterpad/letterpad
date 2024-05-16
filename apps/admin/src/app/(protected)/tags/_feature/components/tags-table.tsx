import { useEffect, useState } from "react";
import { Content, Table } from "ui/dist/index.mjs";

import { TOPIC_PREFIX } from "@/shared/utils";

import { useTagsContext } from "../context";
import { TagRow } from "../types";

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const TagsTable = () => {
  const [dataSource, setDataSource] = useState<TagRow[]>([]);
  const { loading, tags, saveTag, headers } = useTagsContext();

  useEffect(() => {
    if (tags) {
      setDataSource(tags.filter((tag) => !tag.name.startsWith(TOPIC_PREFIX)));
    }
  }, [tags]);

  const columns = headers.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TagRow) => ({
        record,
        editable: col.editable,
        required: col.required,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: saveTag,
      }),
    };
  });

  return (
    <Content>
      <Table
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        loading={!!loading}
      />
    </Content>
  );
};

export default TagsTable;
