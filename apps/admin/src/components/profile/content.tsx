import { useRouter } from "next/router";
import { Accordion, AccordionItem } from "ui";

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
    <Accordion
      onChange={onPanelClick}
      activeKey={router.query.selected as string}
    >
      <AccordionItem
        label="Basic Information"
        id="basic"
        description="Author information and details"
      >
        <Basic data={data} />
      </AccordionItem>
      <AccordionItem
        label="Change Email and Username"
        id="email"
        description="Credentials related information"
      >
        <EmailAndUsername data={data} />
      </AccordionItem>
      <AccordionItem
        label="Social Information"
        id="social"
        description="Change links to social networks"
      >
        <Social social={data.social} id={data.id} />
      </AccordionItem>
      <AccordionItem
        label="Change Password"
        id="changePassword"
        description="Change your password"
      >
        <ChangePassword id={data.id} />
      </AccordionItem>
    </Accordion>
  );
};
