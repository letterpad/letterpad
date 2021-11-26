import { Table, Button, Popconfirm, PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect, useState } from "react";
import { EditableCell, EditableRow } from "@/components/ediitable-table";
import CustomLayout from "@/components/layouts/Layout";
import withAuthCheck from "../hoc/withAuth";
import Head from "next/head";
import { deleteTagApi, fetchTags, saveTags } from "@/components/tags/api";
import { TagRow } from "@/components/tags/types";

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const EditableTable = () => {
  const [dataSource, setDataSource] = useState<TagRow[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchTags().then((response) => {
      if (!response.props.error) {
        setDataSource(
          response.props.data.map((item) => ({
            ...item,
            key: item.id,
            posts: item.posts,
            desc: item.desc || "",
          })),
        );
        setCount(response.props.data.length + 1);
      }
    });
  }, []);

  const handleDelete = async (key: React.Key) => {
    const tagToDelete = [...dataSource].filter((item) => item.key === key);
    if (tagToDelete.length > 0 && tagToDelete[0].id > 0) {
      await deleteTagApi(tagToDelete[0].id);
    }
    setDataSource([...dataSource].filter((item) => item.key !== key));
  };

  const headers = getHeaders(dataSource, handleDelete);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
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
        handleSave: handleSave,
      }),
    };
  });

  const handleAdd = () => {
    const newData: TagRow = {
      key: count + 1,
      name: `new-tag-${count}`,
      id: 0,
      desc: "",
      posts: 0,
      slug: `new-tag-${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = async (row: TagRow, oldData: TagRow[]) => {
    const tags = await saveTags(row, oldData);
    if (tags) setDataSource(tags);
  };

  return (
    <>
      <Head>
        <title>Tags</title>
      </Head>
      <PageHeader className="site-page-header" title="Tags">
        Tags are essentially categories. They allow you to group posts together
        using whatever tag you want and then use these tags to setup your
        navigation menu.
      </PageHeader>
      <Content>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Button
            onClick={handleAdd}
            type="primary"
            style={{ marginBottom: 16 }}
          >
            Add a row
          </Button>
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource}
            columns={columns as ColumnTypes}
          />
        </div>
      </Content>
    </>
  );
};

const EditableTableWithAuth = withAuthCheck(EditableTable);
EditableTableWithAuth.layout = CustomLayout;
export default EditableTableWithAuth;

function getHeaders(dataSource, handleDelete) {
  return [
    {
      title: "name",
      dataIndex: "name",
      width: "30%",
      editable: true,
      required: true,
    },
    {
      title: "desc",
      dataIndex: "desc",
      editable: true,
      required: false,
      render: (_, _record: { key: React.Key }) => {
        return (
          _ || (
            <Button type="dashed" size="small">
              Edit
            </Button>
          )
        );
      },
    },
    {
      title: "posts",
      dataIndex: "posts",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];
}
