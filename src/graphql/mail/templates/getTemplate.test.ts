import { models } from "@/graphql/db/models";
import { EmailTemplates } from "@/graphql/types";
import { getToken } from "@/shared/token";
import {
  AddSubscriberDocument,
  CreateAuthorDocument,
  CreatePostDocument,
  ForgotPasswordDocument,
  UpdateSubscriberDocument,
} from "@/__generated__/queries/mutations.graphql";

import { API } from "../../../../tests/testClient";
import { getEmailTemplate } from "./getTemplate";

describe("Email templates", () => {
  it("gets new post email template", async () => {
    const post = await API({
      query: CreatePostDocument,
      variables: {
        data: {
          title: "new-post-test",
          type: "post",
          cover_image: { src: "https://a.com/image.jpg" },
        },
      },
    });

    const subscriberEmail = "subscriber@test.com";
    await API({
      query: AddSubscriberDocument,
      variables: {
        email: subscriberEmail,
      },
    });
    await API({
      query: UpdateSubscriberDocument,
      variables: {
        data: {
          verified: true,
          secret_id: getToken({ data: { email: subscriberEmail } }),
        },
      },
    });
    const data = await getEmailTemplate(
      {
        template_id: EmailTemplates.NEW_POST,
        post_id: post.createPost.id,
      },
      models,
    );
    if (data.ok) {
      expect(data.content).toMatchInlineSnapshot(`
Object {
  "html": "Hello Friend, <br><br>A new post has been published in <strong>Demo Account</strong>.<br><br><img src=\\"https://a.com/image.jpg\\" width=\\"100%\\"><br><strong>new-post-test</strong><br><br><br><a target=\\"_blank\\" href=\\"https://demo.letterpad.app/post/new-post-test\\">Read More</a><br><br>If you have received this by mistake, you can safely ignore this email.<br>",
  "subject": "Demo Account - New Post",
  "to": Array [
    "subscriber@test.com",
  ],
}
`);
    }
  });

  it("gets new subscriber verification email", async () => {
    const subscriberEmail = "subscriber@test.com";
    await API({
      query: AddSubscriberDocument,
      variables: { email: subscriberEmail },
    });
    const data = await getEmailTemplate(
      {
        template_id: EmailTemplates.VERIFY_NEW_SUBSCRIBER,
        subscriber_email: subscriberEmail,
        author_id: 2,
      },
      models,
    );
    if (data.ok) {
      data.content.html = removeToken(data.content.html);
      expect(data.content).toMatchInlineSnapshot(`
Object {
  "html": "Hello There, <br><br>You have subscribed to <strong>Demo Account</strong> using this email address. Please click the below button to verify this email address.<br><br><a target=\\"_blank\\" href=\\"http://localhost:3000/admin/api/verify?token=&subscriber=1\\"><br>        Verify Email<br>      </a><br><br>If you have received this by mistake, you can safely ignore this email.<br>",
  "subject": "Demo Account - Verify your email",
  "to": "subscriber@test.com",
}
`);
    }
  });

  it("gets new user verification email", async () => {
    const newUserEmail = "newuser@test.com";

    const resonse = await API({
      query: CreateAuthorDocument,
      variables: {
        data: {
          name: "foo",
          email: newUserEmail,
          password: "foofoofoo",
          username: "foo",
          setting: {
            site_title: "hello",
          },
          token: "this token wont be validated in test environment",
        },
      },
    });

    const data = await getEmailTemplate(
      {
        template_id: EmailTemplates.VERIFY_NEW_USER,
        author_id: resonse.createAuthor.id,
      },
      models,
    );
    if (data.ok) {
      data.content.html = removeToken(data.content.html);
      expect(data.content).toMatchInlineSnapshot(`
Object {
  "html": "Hello there, <br><br>You have used this email address while registering in <strong>hello</strong>. Please click the below button to verify this email address.<br><br><a target=\\"_blank\\" href=\\"http://localhost:3000/admin/api/verify?token=",
  "subject": "hello - Verify Email",
  "to": "newuser@test.com",
}
`);
    }
  });

  it("forgot password", async () => {
    await API({
      query: ForgotPasswordDocument,
      variables: {
        email: "demo@demo.com",
      },
    });

    const data = await getEmailTemplate(
      {
        template_id: EmailTemplates.FORGOT_PASSWORD,
        author_id: 2,
      },
      models,
    );
    if (data.ok) {
      data.content.html = removeToken(data.content.html);
      expect(data.content).toMatchInlineSnapshot(`
Object {
  "html": "Hello Demo Author,<br><br>We have received a request to change the password for your <strong>Demo Account</strong> account. Please click the below button to change your password.<br><br><a target=\\"_blank\\"  href=\\"http://localhost:3000/admin/resetPassword?token=",
  "subject": "Demo Account - Reset your password",
  "to": "demo@demo.com",
}
`);
    }
  });
});

export {};

function removeToken(content: string) {
  const [_part1, part2] = content.split("token=");
  const [token, _part3] = part2.split("&");
  return content.replace(token, "");
}
