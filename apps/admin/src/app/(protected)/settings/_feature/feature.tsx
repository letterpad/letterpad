"use client";

import { SettingInputType, SettingsFragmentFragment } from "letterpad-graphql";
import { useDeleteAuthorMutation } from "letterpad-graphql/hooks";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Message, PopConfirm, TextArea } from "ui/dist/index.mjs";

import "./settings.css";

import { getDirtyFields } from "@/lib/react-form";

import { CopyToClipboard } from "@/components/clipboard";
import { SaveButton } from "@/components/save-button";

import { useGetSettings, useUpdateSettings } from "./api.client";
import Ai from "./components/ai";
import Appearance from "./components/appearance";
import Integrations from "./components/integrations";
import { McpTokens } from "./components/mcpTokens";
import Navigation from "./components/navigation";
import Pages from "./components/pages";
import Paypal from "./components/paypal";
import SeoSettings from "./components/seo";

interface Props {
  cloudinaryEnabledByAdmin: boolean;
  mcpEnabled: boolean;
}

const sectionGroups = [
  {
    label: "Website",
    sections: [
      {
        key: "seo",
        title: "Site & SEO",
        description:
          "Edit your site details and how they appear in search results.",
      },
      {
        key: "appearance",
        title: "Appearance",
        description:
          "Manage your branding, site images, footer, and custom CSS.",
      },
      {
        key: "navigation",
        title: "Navigation",
        description:
          "Build your site's menu. The first item becomes your homepage.",
      },
      {
        key: "pages",
        title: "Pages",
        description: "Choose which built-in pages appear on your site.",
      },
    ],
  },
  {
    label: "Services",
    sections: [
      {
        key: "integrations",
        title: "Integrations",
        description:
          "Configure Cloudinary and add scripts or meta tags to your site.",
      },
      {
        key: "payment",
        title: "Payments",
        description: "Choose where to receive your earnings.",
      },
      {
        key: "ai",
        title: "AI",
        description: "Manage access to Letterpad's AI features.",
      },
    ],
  },
  {
    label: "Account",
    sections: [
      {
        key: "keys",
        title: "API keys",
        description:
          "Manage credentials for the Letterpad API and connected tools.",
      },
      {
        key: "delete",
        title: "Delete account",
        description: "Permanently delete your account and its data.",
      },
    ],
  },
];

const sections = sectionGroups.flatMap((group) => group.sections);

export function Settings(props: Props) {
  // The authenticated query can resolve at a different time on either side of hydration.
  const [mounted, setMounted] = useState(false);
  const { data } = useGetSettings(mounted);
  useEffect(() => setMounted(true), []);

  if (!mounted || !data) return null;
  return <SettingsForm key={data.id} initialValues={data} {...props} />;
}

function SettingsForm({
  initialValues,
  cloudinaryEnabledByAdmin,
  mcpEnabled,
}: Props & { initialValues: SettingsFragmentFragment }) {
  const router = useRouter();
  const selected = useSearchParams().get("selected");
  const section = sections.find(({ key }) => key === selected) ?? sections[0];
  const { updateSettings } = useUpdateSettings();
  const [, deleteAuthor] = useDeleteAuthorMutation();
  const methods = useForm({
    defaultValues: initialValues,
    mode: "all",
    reValidateMode: "onChange",
  });
  const {
    handleSubmit,
    reset,
    formState: { dirtyFields, isDirty, isSubmitting },
  } = methods;

  const save = handleSubmit(async (values) => {
    if (!isDirty) return;

    const change = getDirtyFields<SettingInputType>(values, dirtyFields);
    const { data, error } = await updateSettings({ options: change });
    const result = data?.updateOptions;
    if (result?.__typename !== "Setting") {
      Message().error({
        content:
          result && "message" in result
            ? result.message
            : (error?.message ?? "Unable to save settings."),
        duration: 3,
      });
      return;
    }

    reset(result);
  });

  const confirm = async () => {
    await deleteAuthor({});
    router.push("/login?deleted=true");
  };

  return (
    <div className="workspace-settings">
      <nav className="settings-sections" aria-label="Settings sections">
        {sectionGroups.map(({ label, sections }) => (
          <div key={label} className="settings-section-group">
            <h2>{label}</h2>
            <ul>
              {sections.map(({ key, title }) => (
                <li key={key}>
                  <Link
                    href={`/settings?selected=${key}`}
                    scroll={false}
                    prefetch={false}
                    aria-current={section.key === key ? "page" : undefined}
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <label className="settings-section-select">
        <span className="sr-only">Settings section</span>
        <select
          value={section.key}
          onChange={(event) =>
            router.push(`/settings?selected=${event.target.value}`, {
              scroll: false,
            })
          }
        >
          {sectionGroups.map(({ label, sections }) => (
            <optgroup key={label} label={label}>
              {sections.map(({ key, title }) => (
                <option key={key} value={key}>
                  {title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <FormProvider {...methods}>
        <form className="settings-panel" onSubmit={save}>
          <section
            className="settings-panel-body"
            aria-labelledby="settings-section-title"
          >
            <h2 id="settings-section-title">{section.title}</h2>
            <p className="settings-section-description">
              {section.description}
            </p>

            <fieldset disabled={isSubmitting} className="min-w-0">
              {section.key === "seo" && <SeoSettings />}
              {section.key === "appearance" && <Appearance />}
              {section.key === "navigation" && <Navigation />}
              {section.key === "pages" && <Pages />}
              {section.key === "integrations" && (
                <Integrations
                  cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin}
                />
              )}
              {section.key === "payment" && <Paypal />}
              {section.key === "ai" && <Ai />}
              {section.key === "keys" && (
                <>
                  <div className="settings-client-key">
                    <TextArea
                      label="Client key"
                      value={initialValues.client_token}
                      id="client_token"
                      rows={2}
                      readOnly
                    />
                    <CopyToClipboard elementId="client_token" />
                  </div>
                  {mcpEnabled && <McpTokens />}
                </>
              )}
              {section.key === "delete" && (
                <PopConfirm
                  title="Are you sure you want to delete your account?"
                  description="Your data will be permanently deleted and you will be signed out."
                  onConfirm={confirm}
                  okText="Yes, delete"
                  cancelText="Cancel"
                >
                  <Button type="button" variant="danger">
                    Delete account
                  </Button>
                </PopConfirm>
              )}
            </fieldset>
          </section>
          {(section.key !== "delete" || isDirty) && (
            <div className="settings-save">
              <span role="status">
                {isSubmitting
                  ? "Saving…"
                  : isDirty
                    ? "Unsaved changes"
                    : "All changes saved"}
              </span>
              <SaveButton
                disabled={!isDirty || isSubmitting}
                className="settings-save-button"
              />
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
