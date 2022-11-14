import { PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Editor from "@/components/post/components/editor";
import { Buttonv2 } from "@/components_v2/button";
import { Input } from "@/components_v2/input";

import { ROLES } from "@/graphql/types";

enum MemberTypes {
  ALL_VERIFIED_USERS = "Verified Users",
}

const Members = () => {
  const [html, setHtml] = useState("");
  const [subject, setSubject] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const getUsers = async () => {
    const users = await fetch("/admin/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  };

  const sendMail = async (isTest = false) => {
    localStorage.mailHtml = html;
    setLoading(true);
    const result = await fetch("/admin/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        html,
        isTest,
      }),
    }).then((res) => res.json());
    setResult(JSON.stringify(result, null, 2));
    setLoading(false);
  };

  useEffect(() => {
    setHtml(localStorage.mailHtml);
    getUsers();
  }, []);

  return (
    <>
      <Head>
        <title>Mails</title>
      </Head>
      <PageHeader className="site-page-header" title="Media">
        <span className="help-text">
          Here you will find the collection of images that you uploaded from
          your computer.
        </span>
      </PageHeader>
      <Content>
        <div
          className="site-layout-background flex flex-col space-y-4"
          style={{ padding: 24 }}
        >
          <select className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
            <option selected>Choose User Group</option>
            <option value="ALL_VERIFIED_USERS">
              {MemberTypes.ALL_VERIFIED_USERS}
            </option>
          </select>

          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <div>Variables: @name, @username, @email, @profile_link</div>
          <Editor
            onChange={setHtml}
            text={html}
            style={`body {padding: 0 8px !important;font-size: }`}
          />
          <div className="flex justify-end gap-2">
            <Buttonv2 disabled={loading} onClick={() => sendMail(false)}>
              Send
            </Buttonv2>
            <Buttonv2 disabled={loading} onClick={() => sendMail(true)}>
              Send Test Mail
            </Buttonv2>
          </div>
          <div className="mt-10">
            <pre>{result}</pre>
          </div>
        </div>
      </Content>
    </>
  );
};

export default Members;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const isAdmin = session?.user?.role === ROLES.ADMIN;
  //   if (!isAdmin) {
  //     return {
  //       redirect: {
  //         destination: "/posts",
  //         permanent: false,
  //       },
  //     };
  //   }
  return {
    props: {
      isAdmin,
    },
  };
}
