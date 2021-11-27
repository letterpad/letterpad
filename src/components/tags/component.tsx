import { Table, Button } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect, useState } from "react";
import { EditableCell, EditableRow } from "@/components/ediitable-table";
import { TagRow } from "@/components/tags/types";
import { useTagsContext } from "./context";

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

const EditableTable = () => {
  const [dataSource, setDataSource] = useState<TagRow[]>([]);
  const { loading, tags, addTag, saveTag, headers } = useTagsContext();

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
      <div className="site-layout-background" style={{ padding: 24 }}>
        <Button onClick={addTag} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns as ColumnTypes}
          loading={loading}
        />
      </div>
    </Content>
  );
};

export default EditableTable;
