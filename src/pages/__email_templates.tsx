import { getNewPostContent } from "@/mail/emailNewPost";
import { getForgotPasswordContent } from "@/mail/emailForgotPassword";
import { getVerifySubscriberEmailContent } from "@/mail/emailVerifySubscriber";
import { getVerifyUserEmailContent } from "@/mail/emailVerifyUser";
import { useEffect, useRef } from "react";
import { bodyDecorator } from "@/mail/decorator";

const EmailTemplates = (props) => {
  const newPostRef = useRef<HTMLIFrameElement>(null);
  const forgotPasswordRef = useRef<HTMLIFrameElement>(null);
  const verifyMail = useRef<HTMLIFrameElement>(null);
  const newSubscriberRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (newSubscriberRef.current) {
      newSubscriberRef.current.src =
        "data:text/html;charset=utf-8," +
        escape(props.newSubscriberMail.content.html);
    }
    if (newPostRef.current) {
      newPostRef.current.src =
        "data:text/html;charset=utf-8," +
        escape(props.newPostMail.content.html);
    }
    if (verifyMail.current) {
      verifyMail.current.src =
        "data:text/html;charset=utf-8," + escape(props.verifyMail.content.html);
    }

    if (forgotPasswordRef.current) {
      forgotPasswordRef.current.src =
        "data:text/html;charset=utf-8," +
        escape(props.forgotPasswordMail.content.html);
    }
  }, [props]);
  if (!props.newSubscriberMail) return null;
  return (
    <>
      <h3 style={{ padding: 8 }}>
        Subject: {props.newSubscriberMail.content.subject}
      </h3>
      <iframe
        ref={newSubscriberRef}
        width={800}
        height={450}
        frameBorder={0}
      ></iframe>
      <h3 style={{ padding: 8 }}>
        Subject: {props.verifyMail.content.subject}
      </h3>
      <iframe
        ref={verifyMail}
        width={800}
        height={450}
        frameBorder={0}
      ></iframe>
      <h3 style={{ padding: 8 }}>
        Subject: {props.newPostMail.content.subject}
      </h3>
      <iframe
        ref={newPostRef}
        width={800}
        height={750}
        frameBorder={0}
      ></iframe>
      <h3 style={{ padding: 8 }}>
        Subject: {props.forgotPasswordMail.content.subject}
      </h3>
      <iframe
        ref={forgotPasswordRef}
        width={800}
        height={450}
        frameBorder={0}
      ></iframe>
    </>
  );
};

export default EmailTemplates;

export async function getServerSideProps() {
  const verifyMail = await getVerifyUserEmailContent({ author_id: 2 });
  const forgotPasswordMail = await getForgotPasswordContent({ author_id: 2 });
  const newPostMail = await getNewPostContent({ post_id: 29 });
  const newSubscriberMail = await getVerifySubscriberEmailContent({
    author_id: 2,
    subscriber_email: "subscriber@yahoo.com",
  });

  return {
    props: {
      verifyMail: {
        ...verifyMail,
        content: {
          //@ts-ignore
          ...verifyMail.content,
          //@ts-ignore
          html: bodyDecorator(verifyMail.content.html, "demo@demo.com"),
        },
      },
      forgotPasswordMail: {
        ...forgotPasswordMail,
        content: {
          //@ts-ignore
          ...forgotPasswordMail.content,
          //@ts-ignore
          html: bodyDecorator(forgotPasswordMail.content.html, "demo@demo.com"),
        },
      },
      newPostMail: {
        ...newPostMail,
        content: {
          //@ts-ignore
          ...newPostMail.content,
          html: bodyDecorator(
            //@ts-ignore
            newPostMail?.content?.html || newPostMail.message,
            "demo@demo.com",
            true,
          ),
        },
      },
      newSubscriberMail: {
        ...newSubscriberMail,
        content: {
          //@ts-ignore
          ...newSubscriberMail.content,
          //@ts-ignore
          html: bodyDecorator(newSubscriberMail.content.html, "demo@demo.com"),
        },
      },
    }, // will be passed to the page component as props
  };
}
