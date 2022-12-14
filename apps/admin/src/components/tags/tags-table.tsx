import { useEffect, useState } from "react";

import { TagRow } from "@/components/tags/types";
import { Content } from "@/components_v2/content";
import { Table } from "@/components_v2/table";

import { useTagsContext } from "./context";

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const EditableTable = () => {
  const [dataSource, setDataSource] = useState<TagRow[]>([]);
  const { loading, tags, saveTag, headers } = useTagsContext();

  useEffect(() => {
    if (tags) {
      setDataSource(tags);
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
        loading={loading}
      />
    </Content>
  );
};

export default EditableTable;
