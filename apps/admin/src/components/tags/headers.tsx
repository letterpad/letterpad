import { EditOutlined } from "@ant-design/icons";

import { ConfirmPopup } from "@/components/confirm-dialog";

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
          <ConfirmPopup
            callback={(res) => res && deleteTag(record.key)}
            title="Are you sure ?"
            description="This action will remove this tag from all the posts. Are you sure you want to do this ?"
            type="warning"
          />
        ) : null,
    },
  ];
}
