import { signIn } from "next-auth/react";

import { doLogin } from "../../app/(public)/login/_feature/actions";
import { EventAction, EventCategory, EventLabel, track } from "../../track";


export const onLoginAction = async ({ data, serviceUrl, source }) => {
    const result = await doLogin({
        ...data,
        callbackUrl: serviceUrl,
    });
    track({
        eventAction: EventAction.Click,
        eventCategory: EventCategory.Auth,
        eventLabel: EventLabel.CredentialsLogin,
    });
    if (result.success) {
        let redirectUrl = result.redirectUrl;
        if (serviceUrl && new URL(serviceUrl).host !== document.location.host) {
            document.location.href = `/api/identity/login?serviceUrl=${serviceUrl}&source=${source}`;
            return;
        }

        if (redirectUrl?.includes("login")) {
            redirectUrl = redirectUrl.replace("login", "posts");
        }
        if (redirectUrl) {
            alert(redirectUrl);
            // router.push(redirectUrl);
            // document.location.href = `/api/identity/login?source=${redirectUrl}`;
            return;
        }
        return;
    }
    // Message().error({ content: result.message, duration: 5 });
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