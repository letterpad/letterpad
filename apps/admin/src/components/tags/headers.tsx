import { Buttonv2 } from "@/components_v2/button";
import { PopConfirm } from "@/components_v2/popconfirm";

export function getHeaders({ tags, deleteTag, editTag }) {
  return [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
    },
    {
      title: "Total Posts",
      dataIndex: "posts",
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record: { key: React.Key }) =>
        tags.length >= 1 ? (
          <div className="flex gap-2">
            <Buttonv2
              variant="primary"
              size="small"
              onClick={() => editTag(record.key)}
            >
              Rename
            </Buttonv2>
            <PopConfirm
              title="Remove Tag ?"
              description="This action will remove this tag from all the posts. Are you sure you want to continue ?"
              onConfirm={() => deleteTag(record.key)}
            >
              <Buttonv2 variant="danger" size="small">
                Unlink
              </Buttonv2>
            </PopConfirm>
          </div>
        ) : null,
    },
  ];
}
