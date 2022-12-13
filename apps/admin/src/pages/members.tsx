import Head from "next/head";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Editor from "@/components/post/components/editor";
import { Buttonv2 } from "@/components_v2/button";
import { Content } from "@/components_v2/content";
import { Input } from "@/components_v2/input";
import { PageHeader } from "@/components_v2/page-header";
import { Table } from "@/components_v2/table";
import { Tabs } from "@/components_v2/tabs";

import { ROLES } from "@/graphql/types";

import { AdminUsersType } from "@/types";

enum MemberTypes {
  ALL_VERIFIED_USERS = "Verified Users",
}

const Members = () => {
  const [html, setHtml] = useState("");
  const [subject, setSubject] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [domains, setDomains] = useState([]);

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
  }, []);

  const fetchData = async (type: AdminUsersType) => {
    if (!Object.values(AdminUsersType).includes(type)) return;
    const result = await fetch("/admin/api/users?type=" + type, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (type === AdminUsersType.RECENT_USERS) {
      setRecentUsers(result);
    }
    if (type === AdminUsersType.TOP_USERS) {
      setTopUsers(result);
    }
    if (type === AdminUsersType.DOMAIN_MAPPED) {
      setDomains(result);
    }
  };
  return (
    <>
      <Head>
        <title>Mails</title>
      </Head>
      <PageHeader className="site-page-header" title="Members">
        <span className="help-text">
          Here you will find the collection of images that you uploaded from
          your computer.
        </span>
      </PageHeader>
      <Content>
        <Tabs active="Mail" onClick={fetchData}>
          <Tabs.Tab label="Mail" id="Mail">
            <div className="flex flex-col space-y-4">
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
              <div className="shadow-md">
                <Editor
                  onChange={setHtml}
                  text={html}
                  style={`body {padding: 4px 8px !important;font-size: } p,i,a,div {font-size: 1rem !important;}`}
                />
              </div>
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
          </Tabs.Tab>
          <Tabs.Tab label="Recent Users" id={AdminUsersType.RECENT_USERS}>
            <Table
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Username",
                  dataIndex: "username",
                  key: "username",
                },
              ]}
              dataSource={recentUsers}
            />
          </Tabs.Tab>
          <Tabs.Tab label="Top Users" id={AdminUsersType.TOP_USERS}>
            <Table
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Username",
                  dataIndex: "username",
                  key: "username",
                },
                {
                  title: "Posts",
                  dataIndex: "post_count",
                  key: "post_count",
                },
                {
                  title: "ID",
                  dataIndex: "author_id",
                  key: "author_id",
                },
              ]}
              dataSource={topUsers}
            />
          </Tabs.Tab>
          <Tabs.Tab id={AdminUsersType.DOMAIN_MAPPED} label="Domain Mapped">
            <Table
              columns={[
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Username",
                  dataIndex: "username",
                  key: "username",
                },
                {
                  title: "Domain",
                  dataIndex: "domain_name",
                  key: "domain_name",
                },
                {
                  title: "Ssl",
                  dataIndex: "ssl",
                  key: "ssl",
                },
              ]}
              dataSource={domains}
            />
          </Tabs.Tab>
        </Tabs>
      </Content>
    </>
  );
};

export default Members;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const isAdmin = session?.user?.role === ROLES.ADMIN;
  if (!isAdmin) {
    return {
      redirect: {
        destination: "/posts",
        permanent: false,
      },
    };
  }
  return {
    props: {
      isAdmin,
    },
  };
}
