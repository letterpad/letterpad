const About = async () => {
  const req = await fetch("https://letterpad.app/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer xA3xZr0PR6CnGYkvzAXOco689Q3EGxSZqJ7qJvJYUBgMM6Dg7qhRDjJpJjK5fL2xYPA",
    },
    cache: "no-cache",
    body: JSON.stringify({
      query: `
            query {
                post(filters: {slug: "about"}) {
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
  const post = data.data.post;

  return (
    <>
      <section className="w-full mb-5 flex prose dark:prose-dark flex-col overflow-hidden text-lg px-52 py-10">
        <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
      </section>
    </>
  );
};

export default About;
