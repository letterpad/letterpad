import { useRouter } from "next/router";
import React, { useState } from "react";
import { Input, Label, Message, TextArea } from "ui";

import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";
import { useUpdateSettings } from "@/hooks/useUpdateSettings";

import { Logo } from "@/components/login/views/Logo";

import { RegisterStep } from "@/__generated__/__types__";
import { removeTypenames } from "@/shared/utils";
import { EventAction, track } from "@/track";

export const SiteInfo = ({ session, settings }) => {
  const [site_title, setSiteTitle] = useState(settings.site_title);
  const [site_tagline, setSiteTagline] = useState(settings.site_tagline);
  const [design, setDesign] = useState(removeTypenames(settings.design));
  const [site_description, setSiteDescription] = useState(
    settings.site_description
  );
  const [error, setError] = useState<null | Record<string, string>>(null);
  const { updateSettings } = useUpdateSettings();
  const { updateAuthor } = useUpdateAuthor(session.id, false);
  const [_, setProcessing] = useState(false);

  const router = useRouter();

  const processData = () => {
    setProcessing(true);
    setError(null);
    Message().loading({
      content: "Please wait",
      duration: 5,
    });
    let errors = {};

    if (site_title.length < 3) {
      errors = {
        ...errors,
        site_title: "Should be atleast 3 characters long",
      };
    }

    if (site_description.length < 2) {
      errors = {
        ...errors,
        site_description: "Should be atleast 20 characters long",
      };
    }
    if (Object.keys(errors).length > 0) {
      setProcessing(false);
      setError(errors);
      Message().destroy();
      return false;
    }
    return true;
  };
  const updateSite = async () => {
    const processed = processData();
    if (!processed) return;

    const optionsResult = await updateSettings({
      site_title,
      site_description,
      site_tagline,
      design,
    });

    if (optionsResult.data?.updateOptions?.__typename !== "Setting") {
      Message().error({
        content: "Site information update failed",
        duration: 5,
      });
      setProcessing(false);
      return;
    }
    const result = await updateAuthor({
      register_step: RegisterStep.Registered,
    });
    const out = result.data?.updateAuthor;
    if (out?.__typename === "Author") {
      // hack to update session
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
      Message().success({
        content: "Site information updated successfully",
        duration: 5,
      });
      track({
        eventAction: EventAction.Click,
        eventCategory: "register",
        eventLabel: out.register_step!,
      });
      router.push("/posts");
    } else if (out?.__typename === "Failed") {
      Message().error({
        content: out?.message,
        duration: 5,
      });
    }
    setProcessing(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <div className="flex h-screen justify-center">
          <div className="mx-auto flex w-full items-center px-6 lg:w-3/5">
            <div className="flex-1">
              <div className="pb-12 text-center">
                <h2 className="mb-8 text-center text-4xl font-bold text-gray-700 dark:text-white">
                  <Logo />
                </h2>
                <h2 className="text-center text-2xl font-bold text-gray-700 dark:text-white">
                  We need a few more details to update your dashboard
                </h2>
                <p className="mt-3 font-semibold uppercase text-gray-500 dark:text-gray-300">
                  Site Information (2/2)
                </p>
              </div>
              <div className="md:px-40">
                <div className="mt-4">
                  <div>
                    <Label
                      label="Choose a brand color"
                      className="mb-2 text-md"
                    />
                    <input
                      type="color"
                      value={design.brand_color ?? "#d93097"}
                      onChange={(e) =>
                        setDesign({ ...design, brand_color: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <div>
                    <Input
                      label="Name of your site"
                      className="text-md"
                      labelClassName="text-md"
                      value={site_title}
                      onChange={(e) => setSiteTitle(e.target.value)}
                      name="email"
                      id="siteName"
                      data-testid="siteName"
                      placeholder="Give your website a title"
                      required
                    />
                    <p className="text-rose-500">{error?.site_title}</p>
                  </div>
                </div>
                <div className="mt-8">
                  <div>
                    <Input
                      label="Site Tagline"
                      className="text-md"
                      labelClassName="text-md"
                      value={site_tagline}
                      onChange={(e) => setSiteTagline(e.target.value)}
                      name="site_tagline"
                      id="site_tagline"
                      data-testid="siteTagline"
                      placeholder="A short description about your site"
                      limit={60}
                    />
                    <p className="text-rose-500">{error?.site_tagline}</p>
                  </div>
                </div>
                <div className="mt-8">
                  <div>
                    <TextArea
                      label="Site Description"
                      className="text-md"
                      labelClassName="text-md"
                      value={site_description}
                      data-testid="siteDescription"
                      onChange={(e) => setSiteDescription(e.target.value)}
                      name="site_description"
                      id="site_description"
                      placeholder="A short description about your site"
                      limit={190}
                    />
                    <p className="text-rose-500">{error?.site_description}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    className="w-full transform rounded-md bg-blue-500 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    data-testid="updateSiteBtn"
                    onClick={updateSite}
                  >
                    Update Site
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

SiteInfo.noLayout = true;
export default SiteInfo;
