import { EditOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";

export function getHeaders(dataSource, deleteTag) {
  return [
    {
      title: "Name",
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
      title: "Total Posts",
      dataIndex: "posts",
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="This action will remove this tag from all the posts. Are you sure ?"
            onConfirm={() => deleteTag(record.key)}
          >
            <a>Unlink</a>
          </Popconfirm>
        ) : null,
    },
  ];
}
