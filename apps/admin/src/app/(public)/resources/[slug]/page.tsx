import { fetchResource } from "@/resourceFetcher";

const Resource = async ({ params }: { params: { slug: string } }) => {
  const slug = decodeURIComponent(params.slug).replace("resources/", "");
  const post = await fetchResource(slug);
  return (
    <>
      <section className="w-full flex prose dark:prose-dark flex-col overflow-hidden md:text-lg lg:px-52 py-10">
        <div dangerouslySetInnerHTML={{ __html: <>{post.html}</> }}></div>
      </section>
    </>
  );
};

export default Resource;
