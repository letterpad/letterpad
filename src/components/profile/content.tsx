import { Collapse, Form } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";

import { MeFragmentFragment } from "@/__generated__/queries/partial.graphql";

import { Basic } from "./basic";
import { ChangePassword } from "./change-password";
import { Social } from "./social";

interface Props {
  data: MeFragmentFragment;
}
export const Content: React.VFC<Props> = ({ data }) => {
  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 8 }}
      layout="horizontal"
      size={"small"}
    >
      <Collapse defaultActiveKey={["1"]}>
        <Collapse.Panel
          header="Basic Information"
          key="1"
          className="basicProfile"
        >
          <Basic data={data} />
        </Collapse.Panel>
        <CollapsePanel
          header="Social Information"
          key="2"
          className="socialProfile"
        >
          <Social social={data.social} id={data.id} />
        </CollapsePanel>
        <CollapsePanel
          header="Change Password"
          key="3"
          className="changePassword"
        >
          <ChangePassword id={data.id} />
        </CollapsePanel>
      </Collapse>
    </Form>
  );
};
