import { Button, PopConfirm } from "ui";

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
            <Button
              variant="primary"
              size="small"
              onClick={() => editTag(record.key)}
            >
              Rename
            </Button>
            <PopConfirm
              title="Remove Tag ?"
              description="This action will remove this tag from all the posts. Are you sure you want to continue ?"
              onConfirm={() => deleteTag(record.key)}
            >
              <Button variant="danger" size="small">
                Unlink
              </Button>
            </PopConfirm>
          </div>
        ) : null,
    },
  ];
}
