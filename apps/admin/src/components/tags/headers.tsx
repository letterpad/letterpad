import { EditOutlined } from "@ant-design/icons";

import { Buttonv2 } from "@/components_v2/button";
import { PopConfirm } from "@/components_v2/popconfirm";

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
          <PopConfirm
            title="Remove Tag ?"
            description="This action will remove this tag from all the posts. Are you sure you want to continue ?"
            onConfirm={() => deleteTag(record.key)}
          >
            <Buttonv2 variant="danger" size="small">
              Unlink
            </Buttonv2>
          </PopConfirm>
        ) : null,
    },
  ];
}
