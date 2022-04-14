import { Button, Divider, Form, Input, Modal } from "antd";
import { CopyToClipboard } from "../clipboard";
import { useRemoveDomainMutation } from "@/__generated__/queries/mutations.graphql";
import { useDomainMutation } from "@/hooks/useCreateOrUpdateDomain";

export const NewDomain: React.FC<{
  name?: string;
  mapped?: boolean;
  ssl?: boolean;
}> = ({ name, mapped = false }) => {
  const [removeDomain] = useRemoveDomainMutation();
  const { updateLocalState, createUpdateDomain } = useDomainMutation();

  const next = async (values) => {
    const result = await createUpdateDomain({ name: values.domain });
    if (result.data?.createOrUpdateDomain.ok) {
      Modal.success({ content: result.data?.createOrUpdateDomain.message });
    }
  };

  const removeMapping = async () => {
    await removeDomain();
    updateLocalState({ mapped: false, ssl: false });
  };

  return (
    <>
      <br />
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        layout="horizontal"
        size="middle"
        onFinish={next}
      >
        <Form.Item
          label="Map IP"
          name="ip"
          help="Copy this IP and set it as a A record in your Domain under DNS configuration"
        >
          <Input
            readOnly={true}
            style={{ width: "calc(100% - 90px)", opacity: 0.6 }}
            value={"138.68.127.224"}
            id="lpip"
          />
          <CopyToClipboard elementId="lpip" />
        </Form.Item>
        <Divider />
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          Proceed with the below step only after you have mapped the IP with
          your domain <br /> otherwise domain verification will fail.
        </Form.Item>
        <Form.Item
          initialValue={name}
          label="Domain name"
          name="domain"
          help="(without http://, https:// and www)"
          requiredMark={false}
          rules={[
            {
              required: true,
              message: "e.g. example.com, blog.example.com",
              validator: async (_, value) => {
                if (
                  value.match(
                    /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-).)+[a-zA-Z]{2,63}$)/,
                  ) &&
                  value.includes(".")
                ) {
                  return Promise.resolve();
                }

                return Promise.reject();
              },
            },
          ]}
        >
          <Input
            placeholder="e.g. example.com, blog.example.com"
            readOnly={mapped}
          />
        </Form.Item>
        <br />
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          {!mapped && (
            <Button type="primary" htmlType="submit">
              Map my domain
            </Button>
          )}

          {mapped && (
            <Button type="primary" onClick={removeMapping} danger>
              Remove Mapping
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
};
