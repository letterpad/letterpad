import { prisma } from "@/lib/prisma";

import { getRootUrl } from "../../shared/getRootUrl";

export const replaceSubjectVariables = (str: string, data: Record<string, string>) => {
    str = str.replaceAll("{{ company_name }}", "Letterpad");
    str = str.replaceAll("{{ domain_name }}", data.domain_name);
    str = str.replaceAll("{{ blog_name }}", data.site_title);
    str = str.replaceAll("{{ full_name }}", data.full_name);

    return str;
};

export const replaceBodyVariables = (str: string, data: Record<string, string>) => {
    str = str.replaceAll("{{ company_name }}", `<a href="https://letterpad.app">Letterpad</a>`);
    str = str.replaceAll("{{ domain_name }}", `<a href="https://${data.domain_name}">${data.domain_name}</a>`);
    str = str.replaceAll("{{ site_url }}", `<a target="_blank" href="${data.site_url}">
    Visit ${data.site_title}
  </a>`);
    str = str.replaceAll("{{ full_name }}", data.full_name);
    str = str.replaceAll("{{ verify_link }}", `<a target="_blank" href="${data.verify_link}">
    ${data.verify_link_text}
  </a>`);
    str = str.replaceAll("{{ blog_name }}", data.site_title);
    str = str.replaceAll("{{ blog_url }}", data.blog_url);
    str = str.replaceAll("{{ invoice_url }}", data.invoice_url);
    str = str.replaceAll("{{ following_name }}", data?.following_name);
    str = str.replaceAll("{{ follower_profile_link }}", `<a href="${getRootUrl()}/@${data.follower_username}">${data.follower_name}</a>`);

    return str;
}

export const getBaseVariables = async (authorId: string) => {
    const author = await prisma.author.findFirst({
        where: { id: authorId },
        include: {
            setting: true,
            domain: true,
        },
    });
    if (!author) return null;

    let site_url = author.setting?.site_url;
    if (!site_url) {
        const myURL = new URL(getRootUrl());
        site_url = `${myURL.protocol}//${author.username}.${myURL.hostname}`;
    }
    const data = {
        body: {
            company_name: "Letterpad",
            domain_name: author?.domain?.name!,
            site_title: author?.setting?.site_title!,
            full_name: author?.name!,
            site_url: site_url,
            blog_url: site_url,
        },
        subject: {
            company_name: "Letterpad",
            domain_name: author?.domain?.name!,
            site_title: author?.setting?.site_title!,
            full_name: author?.name!,
        },
        meta: {
            author: {
                ...author,
                social: JSON.parse(author.social),
            },
        }
    }
    return data;
}
