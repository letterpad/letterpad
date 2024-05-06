"use client";

import { RegisterStep, SettingInputType } from "letterpad-graphql";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Input, Label, Message, TextArea } from "ui";

import { getDirtyFields } from "@/lib/react-form";

import { useUpdateAuthor } from "@/app/(protected)/posts/_feature/api.client";
import {
  useGetSettings,
  useUpdateSettings,
} from "@/app/(protected)/settings/_feature/api.client";
import { Logo } from "@/app/(public)/login/_feature";
import { registrationPaths } from "@/constants";
import { EventAction, EventCategory, track } from "@/track";
import { isAuthor } from "@/utils/type-guards";

export const SiteInfo = () => {
  const { data: settings } = useGetSettings();
  const session = useSession();
  const methods = useForm({
    values: settings,
  });
  const { handleSubmit, formState, register } = methods;

  const { updateSettings } = useUpdateSettings();
  const { updateAuthor } = useUpdateAuthor();
  const [_, setProcessing] = useState(false);

  const router = useRouter();

  const updateSite = async (change: SettingInputType) => {
    if (!session.data?.user?.id) return null;
    setProcessing(true);
    try {
      await updateSettings({
        options: {
          ...change,
        },
      });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
      Message().error({
        content: "Site information update failed - " + e.message,
        duration: 5,
      });
      setProcessing(false);
      return;
    }

    const result = await updateAuthor({
      register_step: RegisterStep.Registered,
      id: session.data?.user?.id,
    });
    if (result.data?.updateAuthor && isAuthor(result.data?.updateAuthor)) {
      const updatedAuthor = result.data.updateAuthor;
      Message().success({
        content: "Site information updated successfully",
        duration: 3,
      });
      track({
        eventAction: EventAction.Click,
        eventCategory: EventCategory.Auth,
        eventLabel: updatedAuthor.register_step!,
      });
      setProcessing(false);

      await session.update({
        ...session.data,
        user: { ...session.data?.user, register_step: RegisterStep.Registered },
      });
      router.push(registrationPaths[RegisterStep.Registered]);
    } else if (result.data?.updateAuthor?.__typename === "Failed") {
      setProcessing(false);
      Message().error({
        content: result.data?.updateAuthor?.message,
        duration: 5,
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((data) => {
          const change = getDirtyFields(data, formState.dirtyFields);
          if (change) {
            updateSite(change as any);
          }

          // updateSettingsAPI(change).then(() => methods.reset(change));
        })}
      >
        <div className="bg-white dark:bg-gray-900">
          <div className="flex h-screen justify-center">
            <div className="mx-auto flex w-full items-center px-6 lg:w-3/5">
              <div className="flex-1">
                <div className="pb-12 text-center">
                  <h2 className="mb-8 flex justify-center text-4xl font-bold text-gray-700 dark:text-white">
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
                        {...register("design.brand_color", {
                          required: {
                            value: true,
                            message: "Name is required",
                          },
                        })}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div>
                      <Input
                        label="Name of your site"
                        className="text-md"
                        labelClassName="text-md"
                        {...register("site_title", {
                          required: {
                            value: true,
                            message: "Site Title is required",
                          },
                          maxLength: {
                            value: 30,
                            message: "Should be maximum 30 character long",
                          },
                          minLength: {
                            value: 3,
                            message: "Should be minimum 3 character long",
                          },
                        })}
                        id="siteName"
                        data-testid="siteName"
                        placeholder="Give your website a title"
                        required
                      />
                      <p className="text-rose-500">
                        {formState.errors?.site_title?.message}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div>
                      <Input
                        label="Site Tagline"
                        className="text-md"
                        labelClassName="text-md"
                        {...register("site_tagline", {
                          maxLength: {
                            value: 60,
                            message: "Should be maximum 60 character long",
                          },
                          minLength: {
                            value: 3,
                            message: "Should be minimum 3 character long",
                          },
                        })}
                        id="site_tagline"
                        data-testid="siteTagline"
                        placeholder="A short description about your site"
                      />
                      <p className="text-rose-500">
                        {formState.errors?.site_tagline?.message}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div>
                      <TextArea
                        label="Site Description"
                        className="text-md"
                        labelClassName="text-md"
                        {...register("site_description", {
                          maxLength: {
                            value: 190,
                            message: "Should be maximum 30 character long",
                          },
                          minLength: {
                            value: 3,
                            message: "Should be minimum 3 character long",
                          },
                        })}
                        data-testid="siteDescription"
                        id="site_description"
                        placeholder="A short description about your site"
                      />
                      <p className="text-rose-500">
                        {formState.errors?.site_description?.message}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      className="w-full transform rounded-md bg-blue-500 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      data-testid="updateSiteBtn"
                    >
                      Update Site
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

SiteInfo.noLayout = true;
export default SiteInfo;
