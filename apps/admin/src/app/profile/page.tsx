"use client";
import Head from "next/head";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { Accordion, AccordionItem, Content, PageHeader } from "ui";

import { getDirtyFields } from "@/lib/react-form";
import { useUpdateAuthor } from "@/hooks/useUpdateAuthor";

import { Basic } from "@/components/profile/basic";
import { ChangePassword } from "@/components/profile/change-password";
import { EmailAndUsername } from "@/components/profile/emailAndUsername";
import { Social } from "@/components/profile/social";

import { useMeAndSettingsContext } from "../../components/providers/settings";
import { isAuthor } from "../../utils/type-guards";
import { InputAuthor, InputUpdatePost } from "../../../__generated__/__types__";

function Profile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const data = useMeAndSettingsContext();
  const me = isAuthor(data.me) ? data.me : undefined;

  const methods = useForm({
    values: me || {},
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
  const { updateAuthorAPI } = useUpdateAuthor(me?.id ?? 0);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageHeader className="site-page-header" title="Profile">
        <span className="help-text">
          Set up your profile. This will be used by themes to add author
          information for your blog posts.
        </span>
      </PageHeader>
      <Content>
        {me && me?.id && (
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit((data) => {
                const change = getDirtyFields<InputAuthor>(
                  data,
                  formState.dirtyFields
                );
                updateAuthorAPI(change).then(() => methods.reset(change));
              })}
            >
              <Accordion
                onChange={onPanelClick}
                activeKey={searchParams.get("selected")!}
              >
                <AccordionItem
                  label="Basic Information"
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
                  <EmailAndUsername data={me} />
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
                  <ChangePassword id={me.id} />
                </AccordionItem>
              </Accordion>
            </form>
          </FormProvider>
        )}
      </Content>
    </>
  );
}

export default Profile;
