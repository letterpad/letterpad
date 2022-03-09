import withAuthCheck from "../hoc/withAuth";
import CustomLayout from "@/components/layouts/Layout";
import Head from "next/head";
import { PageHeader, Form, Button, Upload, Alert, notification } from "antd";
import { Content } from "antd/lib/layout/layout";
import { basePath } from "@/constants";
import { UploadOutlined } from "@ant-design/icons";
import { getDateTime } from "./../shared/utils";
import { IAuthComponentProps } from "./../shared/types";
import { Role } from "@/__generated__/__types__";
import { UploadChangeParam } from "antd/lib/upload";

// If you want to switch from sqlite3 to mysql then first change the .env.production.local with the appropriate database options and head over to /admin/register first. This will allow you to seed letterpad with mysql. Then login and import the data to populate the exisiting data in mysql.

const Info = () => {
  return (
    <ol>
      <li>Prepare a backup by exporting your blog content</li>
      <li>
        Change `.env.production.local` with the appropriate database option
      </li>
      <li>
        Do a fresh registration. Since the new mysql database does not have any
        information about you, the registration process will create the
        necessary tables and allow you to login.
      </li>
      <li>Come back to this page and import the data.</li>
    </ol>
  );
};
const Migrate = ({ session }: IAuthComponentProps) => {
  return (
    <>
      <Head>
        <title>Migrate</title>
      </Head>
      <PageHeader className="site-page-header" title="Migrate">
        Here you will be able to download the data of your entire blog. You can
        also import blog from another CMS like Ghost.
      </PageHeader>
      <Content>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            layout="horizontal"
            size={"small"}
          >
            <Form.Item label="Export Data">
              <Button
                type="link"
                onClick={() => {
                  fetch(basePath + "/api/export")
                    .then((res) => res.blob())
                    .then(download);
                }}
              >
                Download
              </Button>
            </Form.Item>
            <Form.Item label="Import Letterpad Data">
              <Upload
                type="drag"
                name="import"
                accept=".json"
                action={basePath + "/api/import"}
                onChange={(info: UploadChangeParam) => {
                  if (info.file.status === "done") {
                    if (!info.file.response.success) {
                      openNotificationWithIcon(
                        "error",
                        info.file.response.message,
                      );
                    } else {
                      openNotificationWithIcon(
                        "success",
                        info.file.response.message,
                      );
                      setTimeout(() => {
                        location.href = basePath + "/api/auth/signout";
                      }, 3000);
                    }
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Import Ghost Data">
              <Upload
                type="drag"
                name="ghost"
                accept=".json"
                action={basePath + "/api/import"}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
          {session.role === Role.Admin && (
            <Alert
              description={<Info />}
              message="Migrating from sqlite3 to mysql"
              type="info"
              showIcon
              style={{ marginTop: 40 }}
            />
          )}
        </div>
      </Content>
    </>
  );
};

const MediaWithAuth = withAuthCheck(Migrate);
MediaWithAuth.layout = CustomLayout;
export default MediaWithAuth;

function download(blob: Blob) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = `lp-data-${getDateTime()}.json`;
  a.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 0);
}

const openNotificationWithIcon = (type, description) => {
  notification[type]({
    message: "Data Import",
    description,
  });
};
