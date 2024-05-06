"use client";

import classNames from "classnames";
import { SettingInputType } from "letterpad-graphql";
import { useDeleteAuthorMutation } from "letterpad-graphql/hooks";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Message, PopConfirm, TextArea } from "ui";

import { getDirtyFields } from "@/lib/react-form";

import { CopyToClipboard } from "@/components/clipboard";

import { useGetSettings, useUpdateSettings } from "./api.client";
import Ai from "./components/ai";
import Appearance from "./components/appearance";
import Integrations from "./components/integrations";
import Navigation from "./components/navigation";
import Pages from "./components/pages";
import Paypal from "./components/paypal";
import SeoSettings from "./components/seo";
import { SaveButton } from "../../../../components/save-button";
import { SectionHeader } from "../../../../components/sectionHeader/sectionHeader";

interface Props {
  cloudinaryEnabledByAdmin: boolean;
}

const settingsLinks = [
  { key: "seo", text: "Seo Configuration", url: "/settings?selected=seo" },
  { key: "payment", text: "Payments", url: "/settings?selected=payment" },
  { key: "ai", text: "Ai", url: "/settings?selected=ai" },
  {
    key: "appearance",
    text: "Appearance",
    url: "/settings?selected=appearance",
  },
  { key: "pages", text: "Pages", url: "/settings?selected=pages" },
  {
    key: "navigation",
    text: "Navigation",
    url: "/settings?selected=navigation",
  },
  {
    key: "integrations",
    text: "Integration",
    url: "/settings?selected=integrations",
  },
  { key: "keys", text: "Keys", url: "/settings?selected=keys" },
  { key: "delete", text: "Delete Account", url: "/settings?selected=delete" },
];

export function Settings({ cloudinaryEnabledByAdmin }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useGetSettings();
  const { updateSettings } = useUpdateSettings();
  const [_, deleteAuthor] = useDeleteAuthorMutation();
  const methods = useForm({
    values: data,
    mode: "all",
    reValidateMode: "onChange",
  });
  const { handleSubmit, formState } = methods;
  const selectedKey = searchParams.get("selected") ?? "seo";

  useEffect(() => {
    const container = document.querySelector(`#lp-content`);
    const element = document.querySelector(`#${selectedKey}`) as HTMLElement;
    if (container && element) {
      container.scroll({
        top: element.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [selectedKey]);

  const confirm = async () => {
    await deleteAuthor({});
    router.push("/login?deleted=true");
  };

  const save = async (e) => {
    e.preventDefault();
    // do your early validation here
    handleSubmit((data) => {
      const change = getDirtyFields<SettingInputType>(
        data,
        formState.dirtyFields
      );
      Message().loading({ content: "Saving...", duration: 3 });
      return updateSettings({ options: change }).then((res) => {
        if (res.data?.updateOptions?.__typename === "NotFound") {
          return Message().error({
            content: res.data?.updateOptions.message,
            duration: 3,
          });
        }
        methods.reset(change);
        Message().success({ content: "Saved", duration: 2 });
      });
    })(e);
  };

  if (!data) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={save}>
        {formState.isDirty && (
          <div className="absolute bottom-0 z-20 w-full py-2 text-right -ml-8 md:-ml-16">
            <SaveButton />
          </div>
        )}
        <div className="flex flex-col md:flex-row relative gap-10 md:gap-20">
          <div className="md:p-8 md:sticky top-0 h-full">
            <div className="hidden md:flex flex-col  gap-2">
              {settingsLinks.map(({ key, text, url }) => (
                <Link
                  key={key}
                  className={classNames({
                    "text-blue-500": selectedKey == key,
                  })}
                  href={url}
                >
                  {text}
                </Link>
              ))}
            </div>
            <div className="md:hidden">
              <select
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                onChange={(e) => {
                  const selectedKey = e.target.value;
                  router.push(`/settings?selected=${selectedKey}`);
                }}
                value={selectedKey}
              >
                {settingsLinks.map(({ key, text }) => (
                  <option key={key} value={key}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:p-8 flex-col space-y-10 w-full md:w-1/2">
            <div>
              <SectionHeader
                heading={"Seo Configuration"}
                description={"Basic details and metadata of your site"}
                id="seo"
              />
              <SeoSettings />
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div>
              <SectionHeader
                heading={"Payment Information"}
                description={"Your earnings will be trasferred to this account"}
                id="payment"
              />
              <Paypal />
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div>
              <SectionHeader
                heading={"Open AI"}
                description={"Unlock premium AI-powered features"}
                id="ai"
              />
              <Ai />
            </div>
            <div>
              <SectionHeader
                heading={"Appearance"}
                description={"Customise the look and feel of your site"}
                id="appearance"
              />
              <Appearance />
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div>
              <SectionHeader
                heading={"Pages"}
                description={"Optional pages to add to your site"}
                id="pages"
              />
              <Pages settings={data} />
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className="">
              <SectionHeader
                heading={"Navigation"}
                description={
                  "Configure the navigation menu of your site. The first item in the navigation menu will be the homepage of your blog."
                }
                id="navigation"
              />
              <Navigation />
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div>
              <SectionHeader
                heading={"Integrations"}
                description={"Integrations and code injections"}
                id="integrations"
              />
              <Integrations
                cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin}
              />
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div>
              <SectionHeader
                heading={"Keys"}
                description={"Custom token to access letterpad API"}
                id="keys"
              />

              <div className="mb-8 flex flex-1 items-center gap-2">
                <TextArea
                  label="Client Key"
                  value={data.client_token}
                  id="client_token"
                  rows={2}
                  readOnly
                  className="w-96"
                  cols={100}
                />

                <CopyToClipboard elementId="client_token" />
              </div>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div>
              <SectionHeader
                heading={"Delete Account"}
                description={""}
                id="delete"
              />
              <div className="mb-4 text-gray-700 dark:text-gray-400 whitespace-normal">
                If due to some reason you wish to move out of Letterpad, you may
                delete your account. <br />
                All data will be deleted and you will not be able to recover it.
                You will be logged out after this action.
              </div>
              <PopConfirm
                title="Are you sure you want to delete your account?"
                onConfirm={() => confirm()}
                okText="Yes"
                cancelText="No"
              >
                <Button variant="danger">Delete your account</Button>
              </PopConfirm>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
