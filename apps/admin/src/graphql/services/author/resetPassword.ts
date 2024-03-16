import { ForgotPasswordResponse } from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { EmailTemplates } from "@/graphql/types";
import { decodeJWTToken, verifyToken } from "@/shared/token";
import { getHashedPassword } from "@/utils/bcrypt";

import { ForgotPasswordToken } from "@/types";

export const resetPassword = async (
  args,
  { prisma }: ResolverContext
): Promise<ForgotPasswordResponse> => {
  try {
    const token = args.token;
    const isValidToken = await verifyToken(token);
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
    const newPassword = await getHashedPassword(args.password);

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
