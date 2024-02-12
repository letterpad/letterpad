"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Input, Message, TextArea } from "ui";

import { getDirtyFields } from "@/lib/react-form";

import { InputAuthor, RegisterStep } from "@/__generated__/__types__";
import { Logo } from "@/app/(public)/login/_feature";
import {
  useGetAuthor,
  useUpdateAuthor,
} from "@/app/profile/_feature/api.client";
import { registrationPaths } from "@/constants";
import { EventAction, track } from "@/track";
import { isAuthor } from "@/utils/type-guards";

export const UpdateProfile = () => {
  const { data: me } = useGetAuthor();
  const session = useSession();
  const { updateAuthor } = useUpdateAuthor();

  const [_, setProcessing] = useState(false);

  const router = useRouter();
  const methods = useForm({
    values: me,
  });
  const { handleSubmit, formState, register } = methods;

  const updateProfile = async (author: InputAuthor) => {
    if (!session.data?.user?.id) return router.push("/login");
    setProcessing(true);
    Message().loading({
      content: "Please wait",
      duration: 5,
    });

    const result = await updateAuthor({
      ...author,
      register_step: RegisterStep.SiteInfo,
      id: session.data.user.id,
    });
    const updatedAuthor = result.data?.updateAuthor;
    if (isAuthor(updatedAuthor)) {
      // hack to update session
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
      if (
        updatedAuthor.register_step &&
        updatedAuthor.register_step !== RegisterStep.Registered &&
        RegisterStep[updatedAuthor.register_step]
      ) {
        track({
          eventAction: EventAction.Click,
          eventCategory: "register",
          eventLabel: updatedAuthor.register_step,
        });
        await session.update({
          ...session.data,
          user: {
            ...session.data?.user,
            register_step: RegisterStep.Registered,
          },
        });
        router.push(registrationPaths[updatedAuthor.register_step]);
      }
    } else if (updatedAuthor?.__typename === "Failed") {
      Message().error({
        content: updatedAuthor?.message,
        duration: 5,
      });
    }
    setProcessing(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((data) => {
          const change = getDirtyFields<InputAuthor>(
            data,
            formState.dirtyFields
          );
          if (change) {
            updateProfile(change);
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
                    Author Information (1/2)
                  </p>
                </div>
                <div className="md:px-40">
                  <div className="mt-4">
                    <div>
                      <Input
                        label="Full Name"
                        className="text-md"
                        labelClassName="text-md"
                        id="name"
                        placeholder="John Doe"
                        data-testid="name"
                        {...register("name", {
                          required: {
                            value: true,
                            message: "Name is required",
                          },
                          maxLength: {
                            value: 30,
                            message: "Should be maximum 30 character long",
                          },
                          minLength: {
                            value: 3,
                            message: "Should be minimum 3 character long",
                          },
                          // validate: (value) => {
                          //   debugger;
                          //   const regex = /^([\u00c0-\u01ffa-zA-Z'-])+$/;
                          //   if (!regex.test(value)) {
                          //     return "Should be alpha neumeric with specific special characters";
                          //   }
                          //   return true;
                          // },
                        })}
                      />
                      <p className="text-rose-500">
                        {formState.errors.name?.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div>
                      <Input
                        addonBefore="https://"
                        addonAfter=".letterpad.app"
                        label="Username"
                        className="text-md"
                        labelClassName="text-md"
                        data-testid="username"
                        {...register("username", {
                          required: {
                            value: true,
                            message: "Name is required",
                          },
                          maxLength: {
                            value: 30,
                            message: "Should be maximum 30 character long",
                          },
                          validate: (value) => {
                            // regex to contain alphabets or numbers or both
                            const regex = /^[0-9a-z]+$/;
                            if (!regex.test(value)) {
                              return "Should be alphaneumeric";
                            }
                            return true;
                          },
                        })}
                        id="username"
                        placeholder="jacksparrow"
                      />
                      <p className="text-rose-500">
                        {formState.errors.username?.message}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div>
                      <TextArea
                        label="About you"
                        className="text-md"
                        labelClassName="text-md"
                        {...register("bio", {
                          maxLength: {
                            value: 250,
                            message: "Should be maximum 250 character long",
                          },
                        })}
                        data-testid="bio"
                        name="bio"
                        id="about-me"
                        placeholder="Hi, I am Jack. I am a software engineer. I love to write about tech."
                      />
                      <p className="text-rose-500">
                        {formState.errors.bio?.message}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      className="w-full transform rounded-md bg-blue-500 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      data-testid="updateProfile"
                    >
                      Update Profile
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

export default UpdateProfile;
