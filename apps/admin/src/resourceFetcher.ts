export const fetchResource = async (slug: string) => {
    if (!process.env.LETTERPAD_BLOG_KEY) {
        throw new Error("Please set the environment variable LETTERPAD_BLOG_KEY");
    }
    const req = await fetch(new URL('api/graphql', 'https://letterpad.app').toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization:
                `Bearer ${process.env.LETTERPAD_BLOG_KEY}`,
        },
        cache: "no-cache",
        body: JSON.stringify({
            query: `
            query {
                post(filters: {slug: "${slug}"}) {
                    ...on Post {
                        title
                        html
                    }
                }
            }
            `,
        }),
    });
    const data = await req.json();
    return data?.data?.post as { title: string, html: string, updatedAt: string };
}