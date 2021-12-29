import { getNewPostContent } from "@/mail/emailNewPost";
import { getForgotPasswordContent } from "@/mail/emailForgotPassword";
import { getVerifySubscriberEmailContent } from "@/mail/emailVerifySubscriber";
import { getVerifyUserEmailContent } from "@/mail/emailVerifyUser";
import { useEffect, useRef } from "react";

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
        height={400}
        frameBorder={0}
      ></iframe>
      <h3 style={{ padding: 8 }}>
        Subject: {props.verifyMail.content.subject}
      </h3>
      <iframe
        ref={verifyMail}
        width={800}
        height={400}
        frameBorder={0}
      ></iframe>
      <h3 style={{ padding: 8 }}>
        Subject: {props.newPostMail.content.subject}
      </h3>
      <iframe
        ref={newPostRef}
        width={800}
        height={400}
        frameBorder={0}
      ></iframe>
      <h3 style={{ padding: 8 }}>
        Subject: {props.forgotPasswordMail.content.subject}
      </h3>
      <iframe
        ref={forgotPasswordRef}
        width={800}
        height={400}
        frameBorder={0}
      ></iframe>
    </>
  );
};

export default EmailTemplates;

export async function getServerSideProps(context) {
  const verifyMail = await getVerifyUserEmailContent({ author_id: 2 });
  const forgotPasswordMail = await getForgotPasswordContent({ author_id: 2 });
  const newPostMail = await getNewPostContent({ post_id: 29 });
  const newSubscriberMail = await getVerifySubscriberEmailContent({
    author_id: 2,
    subscriber_email: "subscriber@yahoo.com",
  });

  return {
    props: {
      verifyMail,
      forgotPasswordMail,
      newPostMail,
      newSubscriberMail,
    }, // will be passed to the page component as props
  };
}
