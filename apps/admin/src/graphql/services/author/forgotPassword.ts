import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { EmailTemplates } from "@/graphql/types";

export const forgotPassword = async (args, { prisma }) => {
  try {
    const email = args.email;
    const author = await prisma.author.findFirst({
      where: { email },
    });
    if (!author) {
      return {
        ok: false,
        message: "Email does not exist",
      };
    }
    if (author.verify_attempt_left === 0) {
      return {
        ok: false,
        message: "No more attempts left",
      };
    }

    await enqueueEmailAndSend({
      template_id: EmailTemplates.ForgotPassword,
      author_id: author.id,
    });

    await prisma.author.update({
      data: {
        verify_attempt_left: (author.verify_attempt_left || 3) - 1,
      },
      where: {
        email: author.email,
      },
    });
    return {
      ok: true,
    };
  } catch (e: any) {
    return {
      ok: false,
      message: "Something unexpected happened",
    };
  }
};
