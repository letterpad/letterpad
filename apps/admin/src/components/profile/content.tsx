import { useRouter } from "next/router";

import { Accordion } from "@/components_v2/accordion";

import { MeFragmentFragment } from "@/__generated__/queries/partial.graphql";

import { Basic } from "./basic";
import { ChangePassword } from "./change-password";
import { EmailAndUsername } from "./emailAndUsername";
import { Social } from "./social";

interface Props {
  data: MeFragmentFragment;
}
export const Content: React.VFC<Props> = ({ data }) => {
  const router = useRouter();
  const onPanelClick = (key) => {
    router.replace({ query: { selected: key } });
  };
  return (
    <Accordion onChange={onPanelClick} activeKey={router.query.selected}>
      <Accordion.Item
        label="Basic Information"
        id="basic"
        description="Author information and details"
      >
        <Basic data={data} />
      </Accordion.Item>
      <Accordion.Item
        label="Change Email and Username"
        id="email"
        description="Credentials related information"
      >
        <EmailAndUsername data={data} />
      </Accordion.Item>
      <Accordion.Item
        label="Social Information"
        id="social"
        description="Change links to social networks"
      >
        <Social social={data.social} id={data.id} />
      </Accordion.Item>
      <Accordion.Item
        label="Change Password"
        id="changePassword"
        description="Change your password"
      >
        <ChangePassword id={data.id} />
      </Accordion.Item>
    </Accordion>
  );
};
