import Head from 'next/head';
import { AuthorFrontMatter } from 'types/AuthorFrontMatter';
import { PostFrontMatter } from 'types/PostFrontMatter';

interface CommonSEOProps {
  title: string;
  description: string;
  ogType: string;
  ogImage:
    | string
    | {
        '@type': string;
        url: string;
      }[];
  twImage: string;
  canonicalUrl?: string;
  url: string;
  site_name: string;
  twSite?: string;
}

const CommonSEO = ({
  title,
  description,
  ogType,
  ogImage,
  twImage,
  canonicalUrl,
  url,
  site_name,
  twSite,
}: CommonSEOProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={site_name} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      {Array.isArray(ogImage) ? (
        ogImage.map(({ url }) => <meta property="og:image" content={url} key={url} />)
      ) : (
        <meta property="og:image" content={ogImage} key={ogImage} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
      {twSite && <meta name="twitter:site" content={twSite} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twImage} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Head>
  );
};

interface PageSEOProps {
  title: string;
  description: string;
  site_banner?: string | null;
  site_title: string;
  url: string;
  twSite?: string | null;
}

export const PageSEO = ({
  title,
  description,
  site_banner,
  site_title,
  url,
  twSite,
}: PageSEOProps) => {
  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={site_banner ?? ''}
      site_name={site_title}
      url={url}
      twImage={site_banner ?? ''}
      twSite={twSite ?? ''}
    />
  );
};

export const TagSEO = ({
  title,
  description,
  site_banner,
  site_title,
  twSite,
  url,
}: PageSEOProps) => {
  return (
    <>
      <CommonSEO
        title={title}
        description={description}
        ogType="website"
        ogImage={site_banner ?? ''}
        twImage={site_banner ?? ''}
        site_name={site_title}
        url={url}
        twSite={twSite ?? ''}
      />
      {/* <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${description} - RSS feed`}
          href={`${url}${router.asPath}/feed.xml`}
        />
      </Head> */}
    </>
  );
};

interface BlogSeoProps extends PostFrontMatter {
  authorDetails?: AuthorFrontMatter[];
  url: string;
  site_name: string;
}

export const BlogSEO = ({
  authorDetails,
  title,
  summary,
  date,
  lastmod,
  url,
  images = [],
  canonicalUrl,
  site_name,
}: BlogSeoProps) => {
  const publishedAt = new Date(date).toISOString();
  const modifiedAt = new Date(lastmod || date).toISOString();
  const imagesArr = images.length === 0 ? [] : typeof images === 'string' ? [images] : images;

  const featuredImages = imagesArr.map((img) => {
    return {
      '@type': 'ImageObject',
      url: img,
    };
  });

  let authorList;
  if (authorDetails) {
    authorList = authorDetails.map((author) => {
      return {
        '@type': 'Person',
        name: author.name,
      };
    });
  } else {
    authorList = {
      '@type': 'Person',
      name: site_name,
    };
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    image: featuredImages,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: authorList,
    publisher: {
      '@type': 'Organization',
      name: authorDetails?.pop(),
      logo: {
        '@type': 'ImageObject',
        url: '/static/images/logo.png',
      },
    },
    description: summary,
  };

  const lpImageUrl = featuredImages[0]?.url;

  return (
    <>
      <CommonSEO
        title={title}
        description={summary ?? ''}
        ogType="article"
        ogImage={featuredImages}
        twImage={lpImageUrl}
        canonicalUrl={canonicalUrl}
        url={url}
        site_name={site_name}
      />
      <Head>
        {date && <meta property="article:published_time" content={publishedAt} />}
        {lastmod && <meta property="article:modified_time" content={modifiedAt} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  );
};
