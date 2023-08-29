"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { Accordion, AccordionItem, Button, PopConfirm, TextArea } from "ui";

import { getDirtyFields } from "@/lib/react-form";

import { CopyToClipboard } from "@/components/clipboard";
import Appearance from "@/components/settings/appearance";
import General from "@/components/settings/general";
import Integrations from "@/components/settings/integrations";
import Navigation from "@/components/settings/navigation";
import Pages from "@/components/settings/pages";

import { Setting, SettingInputType } from "@/__generated__/__types__";
import { isSettings } from "@/utils/type-guards";

import { deleteAuthor, updateSetting } from "./api.client";

interface Props {
  cloudinaryEnabledByAdmin: boolean;
  settings: Setting;
}

export function Settings({ cloudinaryEnabledByAdmin, settings }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [deleteAuthor] = useDeleteAuthorMutation();
  const methods = useForm({
    values: isSettings(settings) ? settings : undefined,
  });
  const { handleSubmit, formState } = methods;

  const onPanelClick = (key) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (key) {
      params.set("selected", key);
    } else {
      params.delete("selected");
    }
    // cast to string
    const search = params.toString();
    const query = search ? `?${search}` : "?";
    history.replaceState(null, "", query);
  };

  const confirm = async () => {
    await deleteAuthor();
    router.push("/login?deleted=true");
  };

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) => {
            const change = getDirtyFields<SettingInputType>(
              data,
              formState.dirtyFields
            );
            updateSetting(change).then(() => methods.reset(change));
          })}
        >
          <Accordion
            onChange={onPanelClick}
            activeKey={searchParams.get("selected")!}
          >
            <AccordionItem
              label="General Settings"
              id="general"
              description="Basic details and metadata of your site"
            >
              <General />
            </AccordionItem>
            <AccordionItem
              label="Appearance"
              id="appearance"
              description="Customise the look and feel of your site"
            >
              <Appearance />
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
                The first item in the navigation menu will be the homepage of
                your blog.
              </div>
              <Navigation />
            </AccordionItem>
            <AccordionItem
              label="Integrations"
              id="integrations"
              description="Integrations and code injections"
            >
              <Integrations
                cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin}
              />
            </AccordionItem>
            <AccordionItem
              label="Keys"
              id="keys"
              description="Custom token to access letterpad API"
            >
              <div className="mb-8 flex flex-1 items-center">
                {settings?.__typename === "Setting" && (
                  <TextArea
                    label="Client Key"
                    value={settings.client_token}
                    id="client_token"
                    rows={3}
                    className="w-96"
                  />
                )}
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
                delete your account. All data will be deleted and you will not
                be able to recover it. You will be logged out after this action.
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
        </form>
      </FormProvider>
    </>
  );
}