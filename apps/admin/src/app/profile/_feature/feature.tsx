"use client";

import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { Accordion, AccordionItem, Message } from "ui";

import { getDirtyFields } from "@/lib/react-form";

import { Author, InputAuthor } from "@/__generated__/__types__";

import { useGetAuthor, useUpdateAuthor } from "./api.client";
import { Basic } from "./components/basic";
import { ChangePassword } from "./components/change-password";
import { EmailAndUsername } from "./components/emailAndUsername";
import { Social } from "./components/social";

export const Feature = () => {
  const { data, fetching } = useGetAuthor();
  const { updateAuthor } = useUpdateAuthor();

  const searchParams = useSearchParams();
  const methods = useForm<Author | {}>({
    values: data || {},
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

  if (fetching || !data) return <>Please wait...</>;

  return (
    <>
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
          <Accordion
            onChange={onPanelClick}
            activeKey={searchParams.get("selected")!}
          >
            <AccordionItem
              label="About you"
              id="basic"
              description="Author information and details"
            >
              <Basic />
            </AccordionItem>
            <AccordionItem
              label="Change Email and Username"
              id="email"
              description="Credentials related information"
            >
              <EmailAndUsername data={data} />
            </AccordionItem>
            <AccordionItem
              label="Social Information"
              id="social"
              description="Change links to social networks"
            >
              <Social />
            </AccordionItem>
            <AccordionItem
              label="Change Password"
              id="changePassword"
              description="Change your password"
            >
              <ChangePassword id={data.id} />
            </AccordionItem>
          </Accordion>
        </form>
      </FormProvider>
    </>
  );
};
