import { fetchResource } from "@/resourceFetcher";

const Resource = async ({ params }: { params: { slug: string } }) => {
  const slug = decodeURIComponent(params.slug);
  const post = await fetchResource(slug);
  return (
    <>
      <section className="w-full mb-5 flex prose dark:prose-dark flex-col overflow-hidden text-lg px-52 py-10">
        <div dangerouslySetInnerHTML={{ __html: <>{post.html}</> }}></div>
      </section>
    </>
  );
};

export default Resource;
