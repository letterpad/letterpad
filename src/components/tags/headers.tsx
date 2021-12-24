import { EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

export function getHeaders(dataSource, deleteTag) {
  return [
    {
      title: "name",
      dataIndex: "name",
      width: "30%",
      editable: true,
      required: true,
      render: (text: string) => {
        return (
          <span>
            <EditOutlined /> &nbsp;&nbsp;{text}
          </span>
        );
      },
    },
    {
      title: "desc",
      dataIndex: "desc",
      editable: true,
      required: false,
      render: (_, _record: { key: React.Key }) => {
        return _ || <EditOutlined />;
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
            onConfirm={() => deleteTag(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];
}
