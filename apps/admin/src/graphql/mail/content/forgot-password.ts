import {
    EmailForgotPasswordProps,
    EmailTemplateResponse,
} from "@/graphql/types";
import { getRootUrl } from "@/shared/getRootUrl";
import { getForgotPasswordToken } from "@/shared/token";

import { getTemplate } from "../template";
import { addLineBreaks } from "../utils";
import { getBaseVariables, replaceBodyVariables, replaceSubjectVariables } from "../variables";

export async function getForgotPasswordContent(
    data: EmailForgotPasswordProps,
): Promise<EmailTemplateResponse> {
    const template = await getTemplate(data.template_id);

    const variables = await getBaseVariables(data.author_id);
    if (!variables) {
        return {
            ok: false,
            message: `No base variables found for the current blog.`,
        };
    }
    const token = await getForgotPasswordToken({
        email: variables.meta.author.email,
    });
    const change_password_link = `${getRootUrl()}/resetPassword?token=${token}`;


    const subject = replaceSubjectVariables(template.subject, variables.subject);
    const body = replaceBodyVariables(template.body, { ...variables.body, change_password_link });

    return {
        ok: true,
        content: { subject, html: addLineBreaks(body), to: variables.meta.author.email },
        meta: variables.meta,
    };
}
