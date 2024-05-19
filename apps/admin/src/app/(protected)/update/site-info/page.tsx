"use client";

import classNames from "classnames";
import { RegisterStep, Setting } from "letterpad-graphql";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  TextArea,
} from "ui/dist/index.mjs";

import { Logo } from "@/components/auth/logo";

import { useUpdateAuthor } from "@/app/(protected)/posts/_feature/api.client";
import {
  useGetSettings,
  useUpdateSettings,
} from "@/app/(protected)/settings/_feature/api.client";
import { registrationPaths } from "@/constants";
import { EventAction, EventCategory, track } from "@/track";
import { isAuthor } from "@/utils/type-guards";

type UpdateProps = Pick<
  Setting,
  "site_title" | "site_description" | "design" | "site_tagline"
>;

export const SiteInfo = () => {
  const { data: settings } = useGetSettings();
  const session = useSession();
  const {
    design,
    site_title = "",
    site_description = "",
    site_tagline = "",
  } = settings ?? {};

  const methods = useForm<UpdateProps>({
    values: { site_title, site_description, design, site_tagline },
  });
  const { handleSubmit, formState, register } = methods;

  const { updateSettings } = useUpdateSettings();
  const { updateAuthor } = useUpdateAuthor();
  const [busy, setBusy] = useState(false);

  const router = useRouter();

  const updateSite = async (change: UpdateProps) => {
    if (!session.data?.user?.id) return null;
    setBusy(true);
    try {
      await updateSettings({
        options: {
          ...change,
        },
      });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
      setBusy(false);
      return;
    }

    const result = await updateAuthor({
      register_step: RegisterStep.Registered,
      id: session.data?.user?.id,
    });
    if (result.data?.updateAuthor && isAuthor(result.data?.updateAuthor)) {
      const updatedAuthor = result.data.updateAuthor;
      track({
        eventAction: EventAction.Click,
        eventCategory: EventCategory.Auth,
        eventLabel: updatedAuthor.register_step!,
      });
      setBusy(false);

      await session.update({
        register_step: RegisterStep.Registered,
      });
      router.push(registrationPaths[RegisterStep.Registered]);
    } else if (result.data?.updateAuthor?.__typename === "Failed") {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-1 flex-col">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(updateSite)}
          className="m-auto max-w-xl w-full"
        >
          <Card
            className={classNames({
              "border-transparent bg-transparent shadow-none": true,
            })}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Blog Details</CardTitle>
              <CardDescription>Site Information (2/2)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
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
                    <Button
                      data-testid="updateSiteBtn"
                      type="submit"
                      className="w-full"
                    >
                      Update Site
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
};

SiteInfo.noLayout = true;
export default SiteInfo;
