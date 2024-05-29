"use client";

import classNames from "classnames";
import { Author, RegisterStep } from "letterpad-graphql";
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
  Message,
  TextArea,
} from "ui/dist/index.mjs";

import {
  useGetAuthor,
  useUpdateAuthor,
} from "@/app/(protected)/profile/_feature/api.client";
import { EventAction, EventCategory, track } from "@/track";
import { isAuthor } from "@/utils/type-guards";

import { registrationPaths } from "../../../../constants";

type UpdateProps = Pick<Author, "name" | "bio" | "username">;

export const UpdateProfile = () => {
  const { data: me } = useGetAuthor();
  const { data, update } = useSession();
  const { updateAuthor } = useUpdateAuthor();

  const [_, setProcessing] = useState(false);
  const { name = "", bio, username } = me || {};
  const router = useRouter();
  const methods = useForm({
    values: { name, bio, username },
  });
  const { handleSubmit, formState, register } = methods;

  const updateProfile = async (author: UpdateProps) => {
    if (!data?.user?.id) return router.push("/login");
    setProcessing(true);
    Message().loading({
      content: "Please wait",
      duration: 50,
    });

    const result = await updateAuthor({
      ...author,
      register_step: RegisterStep.SiteInfo,
      id: data.user.id,
    });
    const updatedAuthor = result.data?.updateAuthor;
    if (isAuthor(updatedAuthor)) {
      // hack to update session
      // const event = new Event("visibilitychange");
      // document.dispatchEvent(event);
      if (
        updatedAuthor.register_step &&
        updatedAuthor.register_step !== RegisterStep.Registered &&
        RegisterStep[updatedAuthor.register_step]
      ) {
        track({
          eventAction: EventAction.Click,
          eventCategory: EventCategory.Auth,
          eventLabel: updatedAuthor.register_step,
        });
        await update({
          username: updatedAuthor.username,
          name: updatedAuthor.name,
          register_step: RegisterStep.SiteInfo,
        });

        router.push(registrationPaths[updatedAuthor.register_step]);
      }
    } else if (updatedAuthor?.__typename === "Failed") {
      Message().error({
        content: updatedAuthor?.message,
        duration: 5,
      });
    }
    Message().destroy();
    setProcessing(false);
  };

  return (
    <div className="flex items-center justify-center flex-1 flex-col">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(updateProfile)}
          className="m-auto max-w-xl w-full"
        >
          <Card
            className={classNames({
              "border-transparent bg-transparent shadow-none": true,
            })}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-lg">
                We need a few more Information
              </CardTitle>
              <CardDescription>Author Information (1/2)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
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
                          const regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]*$/;
                          if (value && !regex.test(value)) {
                            return "Can be either alphabets or alphabets and numbers.";
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
                          value: 4000,
                          message: "Should be maximum 4000 character long",
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
                  <Button
                    data-testid="updateProfileBtn"
                    type="submit"
                    className="w-full"
                  >
                    Update Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
};

export default UpdateProfile;
