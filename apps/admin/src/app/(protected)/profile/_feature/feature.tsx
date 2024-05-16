"use client";

import classNames from "classnames";
import { Author, InputAuthor } from "letterpad-graphql";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Message } from "ui/dist/index.mjs";

import { getDirtyFields } from "@/lib/react-form";

import { useGetAuthor, useUpdateAuthor } from "./api.client";
import { Basic } from "./components/basic";
import { ChangePassword } from "./components/change-password";
import { EmailAndUsername } from "./components/emailAndUsername";
import { Social } from "./components/social";
import { SaveButton } from "../../../../components/save-button";
import { SectionHeader } from "../../../../components/sectionHeader/sectionHeader";

const profileLinks = [
  { key: "basic", text: "About you", url: "/profile?selected=basic" },
  { key: "email", text: "Account", url: "/profile?selected=email" },
  { key: "social", text: "Social Links", url: "/profile?selected=social" },
];

export const Feature = () => {
  const router = useRouter();
  const { data, fetching } = useGetAuthor();
  const { updateAuthor } = useUpdateAuthor();

  const searchParams = useSearchParams();
  const methods = useForm<Author | {}>({
    values: data || {},
    mode: "all",
    reValidateMode: "onChange",
  });
  const { handleSubmit, formState } = methods;
  const selectedKey = searchParams.get("selected") ?? "basic";

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

  if (fetching || !data) return <>Please wait...</>;
  const dirtyFields = Object.keys(formState.dirtyFields).filter((key) => {
    if (key === "password") return false;
    if (key === "email") return false;
    if (key === "username") return false;
    return true;
  });
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((fields) => {
          const change = getDirtyFields<InputAuthor>(
            fields,
            formState.dirtyFields
          );
          Message().loading({ content: "Saving...", duration: 3 });
          updateAuthor({
            ...change,
            id: data.id,
          }).then(() => {
            methods.reset(fields);
            Message().success({ content: "Saved", duration: 2 });
          });
        })}
      >
        {dirtyFields.length > 0 && (
          <div className="absolute bottom-0 z-20 w-full py-2 text-right -ml-8 md:-ml-16">
            <SaveButton />
          </div>
        )}
        <div className="flex flex-col md:flex-row relative gap-10 md:gap-20">
          <div className="md:p-8 md:sticky top-0 h-full">
            <div className="hidden md:flex flex-col  gap-2">
              {profileLinks.map(({ key, text, url }) => (
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
                {profileLinks.map(({ key, text }) => (
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
                heading="About you"
                id="basic"
                description="Author information and details"
              />
              <Basic />
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div>
              <SectionHeader
                heading="Account Information"
                id="email"
                description="Credentials related information"
              />
              <EmailAndUsername data={data} />
              <ChangePassword id={data.id} />
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

            <div>
              <SectionHeader
                heading="Social Information"
                id="social"
                description="Change links to social networks"
              />
              <Social />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
