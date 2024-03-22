import Link from "next/link";

import { Banner } from "../../../components/website_v2/banner/banner";
import { fetchPostsOfClient } from "../../../resourceFetcher";
import { getRootUrl } from "../../../shared/getRootUrl";

const Resources = async () => {
  const posts = await fetchPostsOfClient();
  return (
    <>
      <Banner
        title="Resources"
        description="Helpful guides for getting started and getting the most out of
          Letterpad"
      />
      <div className="max-w-5xl mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            return (
              <Link
                href={
                  new URL(
                    `resources${post.slug.replace("post/", "")}`,
                    getRootUrl()
                  )
                }
                className="px-4 md:px-0 "
              >
                <div className="md:max-w-sm rounded-lg overflow-hidden shadow-lg dark:bg-neutral-900">
                  <img
                    className="w-full m-0 h-52 object-cover"
                    src={post.cover_image.src}
                    alt={post.title}
                  />
                  <div className="p-4">
                    <div className="font-bold text-md font-heading">
                      {post.title}
                    </div>
                    <p className="font-paragraph mt-1">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center  p-4">
                    <img
                      className="w-6 h-6 rounded object-cover mr-2"
                      src={post.author.avatar}
                      alt="Avatar of Jonathan Reinink"
                    />
                    <div className="text-sm">
                      <p className="leading-none">{post.author.name}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Resources;
