import { sendVerifyUserEmail } from "@/mail";
import { useEffect, useRef } from "react";

const EmailTemplates = (props) => {
  const newPostRef = useRef<HTMLIFrameElement>(null);

  // const newPost = templates.postTemplate({
  //   name: "User",
  //   cover_image:
  //     "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1440&auto=format&lossless=true",
  //   excerpt:
  //     "We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.",
  //   title: "New Blog",
  //   url: "https://clickme.com",
  // });

  useEffect(() => {
    if (newPostRef.current) {
      newPostRef.current.src =
        "data:text/html;charset=utf-8," + escape(props.verifyMail);
    }
  }, [props]);

  return (
    <iframe ref={newPostRef} width={800} height={800} frameBorder={0}></iframe>
  );
};

export default EmailTemplates;

export async function getServerSideProps(context) {
  const verifyMail = await sendVerifyUserEmail({ author_id: 2 });

  return {
    props: {
      verifyMail,
    }, // will be passed to the page component as props
  };
}
