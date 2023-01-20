import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React, { useState } from "react";
import { Input, Message, TextArea } from "ui";

import { Logo } from "@/components/login/views/Logo";

import { RegisterStep } from "@/__generated__/__types__";
import {
  UpdateAuthorDocument,
  useUpdateAuthorMutation,
} from "@/__generated__/queries/mutations.graphql";
import { registrationPaths } from "@/constants";
import { sanitizeUsername } from "@/shared/utils";
import { EventAction, track } from "@/track";

export const UpdateProfile = ({ session, me }) => {
  const [name, setName] = useState(session.name);
  const [username, setUsername] = useState(
    isInteger(session.username) ? "" : session.username
  );
  const [bio, setBio] = useState(me.bio);
  const [error, setError] = useState<null | Record<string, string>>(null);
  const [updateAuthor] = useUpdateAuthorMutation();

  const [_, setProcessing] = useState(false);

  const router = useRouter();

  const updateProfile = async () => {
    if (!session.id) return router.push("/login");
    setProcessing(true);
    setError(null);
    Message().loading({
      content: "Please wait",
      duration: 5,
    });
    let errors = {};

    if (!username || !sanitizeUsername(username)) {
      errors = {
        ...errors,
        username: "Only letters, numbers, underscore and hyphen are allowed",
      };
    }

    if (name.length < 3 || name.search(/^([ \u00c0-\u01ffa-zA-Z'-])+$/) < 0) {
      errors = {
        ...errors,
        name: "Should be 3 character long and may contain specific special characters",
      };
    }
    if (Object.keys(errors).length > 0) {
      setProcessing(false);
      setError(errors);
      Message().destroy();
      return;
    }
    const result = await updateAuthor({
      mutation: UpdateAuthorDocument,
      variables: {
        author: {
          username,
          name,
          bio,
          register_step: RegisterStep.SiteInfo,
          id: session.id,
        },
      },
    });
    const out = result.data?.updateAuthor;
    if (out?.__typename === "Author") {
      // hack to update session
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);
      if (
        out.register_step &&
        out.register_step !== RegisterStep.Registered &&
        RegisterStep[out.register_step]
      ) {
        track({
          eventAction: EventAction.Click,
          eventCategory: "register",
          eventLabel: out.register_step,
        });
        router.push(registrationPaths[out.register_step]);
      }
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      name="email"
                      id="name"
                      placeholder="John Doe"
                      data-testid="name"
                      required
                    />
                    <p className="text-rose-500">{error?.name}</p>
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
                      value={username}
                      onChange={(e) => setUsername(e.target.value.trim())}
                      name="username"
                      id="username"
                      placeholder="jacksparrow"
                    />
                    <p className="text-rose-500">{error?.username}</p>
                  </div>
                </div>
                <div className="mt-8">
                  <div>
                    <TextArea
                      label="About you"
                      className="text-md"
                      labelClassName="text-md"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      data-testid="bio"
                      name="bio"
                      id="about-me"
                      placeholder="Hi, I am Jack. I am a software engineer. I love to write about tech."
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    className="w-full transform rounded-md bg-blue-500 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    data-testid="updateProfile"
                    onClick={updateProfile}
                  >
                    Update Profile
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

UpdateProfile.noLayout = true;
export default UpdateProfile;

const isInteger = (num) => /^-?[0-9]+$/.test(num + "");
