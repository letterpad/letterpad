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
                        sub_title
                        author {
                            ...on Author{
                                name
                                avatar
                            }
                        }
                    }
                }
            }
            `,
        }),
    });
    const data = await req.json();
    return data?.data?.post as { title: string, html: string, updatedAt: string, sub_title: string };
}

export const fetchPostsOfClient = async () => {
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
                posts(filters: {status: published, sortBy: asc}) {
                    ...on PostsNode {
                        rows {
                            title
                            cover_image {
                                src
                                width
                                height
                            }
                            sub_title
                            excerpt
                            slug
                            author {
                                ...on Author{
                                    name
                                    avatar
                                }
                            }
                        }
                    }
                }
            }
            `,
        }),
    });
    const data = await req.json();
    return data?.data?.posts.rows.filter(post => parseInt(post.title)) as {
        title: string, html: string, sub_title: string, excerpt: string, slug: string, author: { name: string, avatar: string }, cover_image: {
            src: string,
            width: number,
            height: number
        }
    }[];
}