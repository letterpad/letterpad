import Head from "next/head";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { Accordion, AccordionItem, Content, PageHeader } from "ui";

import { Basic } from "@/components/profile/basic";
import { ChangePassword } from "@/components/profile/change-password";
import { EmailAndUsername } from "@/components/profile/emailAndUsername";
import { Social } from "@/components/profile/social";

import { useUpdateAuthor } from "../hooks/useUpdateAuthor";
import { getDirtyFields } from "../lib/react-form";

function Profile({ me }) {
  const router = useRouter();
  const methods = useForm({ defaultValues: me });
  const { handleSubmit, formState } = methods;
  const onPanelClick = (key) => {
    router.replace({ query: { selected: key } });
  };
  const { updateAuthorAPI } = useUpdateAuthor(me.id);
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
        {me?.__typename === "Author" && (
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit((data) => {
                const change = getDirtyFields(data, formState.dirtyFields);
                updateAuthorAPI(change).then(() => methods.reset(change));
              })}
            >
              <Accordion
                onChange={onPanelClick}
                activeKey={router.query.selected as string}
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
