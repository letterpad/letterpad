import { signIn } from "next-auth/react";

import { basePath } from "../../constants";
import { getRootUrl } from "../../shared/getRootUrl";
import { EventAction, EventCategory, EventLabel, track } from "../../track";


export const onLoginAction = async ({ data, serviceUrl, source }) => {
    const result = await signIn("email", {
        redirect: false,
        email: data.email,
        callbackUrl: `${getRootUrl()}/api/identity/login?serviceUrl=${serviceUrl}&source=${source}` ?? basePath + "/posts",
    });
    track({
        eventAction: EventAction.Click,
        eventCategory: EventCategory.Auth,
        eventLabel: EventLabel.CredentialsLogin,
    });
    if (result?.ok) {
        // redirect to a page displaying a message that the email has been sent with the login link
    }
};
export const onRegisterAction = async ({ data, captchaToken }) => {
    if (captchaToken) {
        const result = await fetch("/api/validateCaptcha", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: captchaToken }),
        }).then((res) => res.json());

        if (!result.success) {
            track({
                eventAction: EventAction.Change,
                eventCategory: EventCategory.Auth,
                eventLabel: 'captcha-failed',
            });
            return;
        }
    }
    const result = await signIn("email", {
        redirect: false,
        email: data.email,
        callbackUrl: typeof window === "undefined" ? "" : window.location.href,
    });

    if (result?.ok) {
        track({
            eventAction: EventAction.Click,
            eventCategory: EventCategory.Auth,
            eventLabel: EventLabel.Registered,
        });
    }
}