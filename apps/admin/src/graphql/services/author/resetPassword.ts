import bcrypt from "bcryptjs";

import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { EmailTemplates } from "@/graphql/types";
import { decodeJWTToken, verifyToken } from "@/shared/token";

import { ForgotPasswordToken } from "@/types";

export const resetPassword = async (
  args,
  { prisma }: ResolverContext,
): Promise<ResolversTypes["ForgotPasswordResponse"]> => {
  try {
    const token = args.token;
    const isValidToken = verifyToken(token);
    if (!isValidToken) {
      throw new Error("The link is not valid.");
    }

    const authorEmail = decodeJWTToken<ForgotPasswordToken>(token);

    const author = await prisma.author.findFirst({
      where: { email: authorEmail.email },
    });

    if (!author) {
      throw new Error("Sorry, we could not validate this request.");
    }
    const newPassword = await bcrypt.hash(args.password, 12);

    await prisma.author.update({
      data: {
        password: newPassword,
        verify_attempt_left: 3,
        verified: true,
      },
      where: { id: author.id },
    });
    await enqueueEmailAndSend({
      author_id: author.id,
      template_id: EmailTemplates.PasswordChangeSuccess,
    });
    return {
      ok: true,
      message: "Password changed successfully",
    };
  } catch (e: any) {
    return {
      ok: false,
      message: e.message,
    };
  }
};
