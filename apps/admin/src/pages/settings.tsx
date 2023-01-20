import Head from "next/head";
import { useRouter } from "next/router";
import {
  Accordion,
  AccordionItem,
  Button,
  Content,
  PageHeader,
  PopConfirm,
  TextArea,
} from "ui";

import { CopyToClipboard } from "@/components/clipboard";
import Appearance from "@/components/settings/appearance";
import General from "@/components/settings/general";
import Integrations from "@/components/settings/integrations";
import Navigation from "@/components/settings/navigation";
import Pages from "@/components/settings/pages";

import { useDeleteAuthorMutation } from "@/__generated__/queries/mutations.graphql";
import { SettingsFragmentFragment } from "@/__generated__/queries/queries.graphql";

import { PageProps } from "@/types";

interface Props extends PageProps {
  settings: SettingsFragmentFragment;
  cloudinaryEnabledByAdmin: boolean;
}
function Settings({ settings, cloudinaryEnabledByAdmin }: Props) {
  const router = useRouter();
  const onPanelClick = (key) => {
    router.replace({ query: { selected: key } });
  };
  const [deleteAuthor] = useDeleteAuthorMutation();

  const confirm = async () => {
    await deleteAuthor();
    router.push("/login?deleted=true");
  };

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <PageHeader className="site-page-header" title="Settings">
        <span className="help-text">
          Here you can customize your blog&apos;s settings.
        </span>
      </PageHeader>
      <Content>
        <Accordion
          onChange={onPanelClick}
          activeKey={router.query.selected as string}
        >
          <AccordionItem
            label="General Settings"
            id="general"
            description="Basic details and metadata of your site"
          >
            <General settings={settings} />
          </AccordionItem>
          <AccordionItem
            label="Appearance"
            id="appearance"
            description="Customise the look and feel of your site"
          >
            <Appearance settings={settings} />
          </AccordionItem>
          <AccordionItem
            label="Pages"
            id="pages"
            description="Optional pages to add to your site"
          >
            <Pages settings={settings} />
          </AccordionItem>
          <AccordionItem
            label="Navigation"
            id="navigation"
            description="Configure the navigation menu of your site"
          >
            <div className="pb-8 dark:text-gray-400">
              The first item in the navigation menu will be the homepage of your
              blog.
            </div>
            <Navigation settings={settings} />
          </AccordionItem>
          <AccordionItem
            label="Integrations"
            id="integrations"
            description="Integrations and code injections"
          >
            <Integrations
              settings={settings}
              cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin}
            />
          </AccordionItem>
          <AccordionItem
            label="Keys"
            id="keys"
            description="Custom token to access letterpad API"
          >
            <div className="mb-8 flex flex-1 items-center">
              <TextArea
                label="Client Key"
                value={settings.client_token}
                id="client_token"
                rows={3}
                className="w-96"
              />
              <CopyToClipboard elementId="client_token" />
            </div>
          </AccordionItem>
          <AccordionItem
            label="Delete your account"
            id="account"
            description="Danger Zone"
          >
            <div className="mb-4 text-gray-500">
              If due to some reason you wish to move out of Letterpad, you may
              delete your account. All data will be deleted and you will not be
              able to recover it. You will be logged out after this action.
            </div>
            <PopConfirm
              title="Are you sure you want to delete your account ?"
              onConfirm={() => confirm}
              okText="Yes"
              cancelText="No"
            >
              <Button variant="danger">Delete your account</Button>
            </PopConfirm>
          </AccordionItem>
        </Accordion>
      </Content>
    </>
  );
}

export default Settings;

export async function getServerSideProps(context) {
  return {
    props: {
      cloudinaryEnabledByAdmin: !!(
        process.env.CLOUDINARY_KEY &&
        process.env.CLOUDINARY_NAME &&
        process.env.CLOUDINARY_SECRET
      ),
    },
  };
}
