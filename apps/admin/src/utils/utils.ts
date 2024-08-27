import { PostsFilters, PostStatusOptions, PostTypes, SortBy } from "letterpad-graphql";

export const isSqliteDb = () => {
  return process.env.DATABASE_URL?.startsWith("file");
};

export const isPostgresDb = () => {
  return process.env.DATABASE_URL?.includes("postgres");
};


export const isValidEmail = (email: string) => {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

export const convertParamsToFilters = (params: URLSearchParams): PostsFilters => {
  const args = {
    author: params.get('author') || undefined,
    banned: params.has('banned') ? params.get('banned') === 'true' : undefined,
    cursor: params.get('cursor') || undefined,
    featured: params.has('featured') ? params.get('featured') === 'true' : undefined,
    id: params.get('id') || undefined,
    limit: params.has('limit') ? Number(params.get('limit')) : undefined,
    offset: params.has('offset') ? Number(params.get('offset')) : undefined,
    page: params.has('page') ? Number(params.get('page')) : undefined,
    page_type: params.get('page_type') || undefined,
    previewHash: params.get('previewHash') || undefined,
    search: params.get('search') || undefined,
    slug: params.get('slug') || undefined,
    sortBy: params.get('sortBy') as SortBy || undefined,
    status: convertArray<PostStatusOptions>(params.getAll('status')),
    tag: params.get('tag') || undefined,
    tagSlug: params.get('tagSlug') || undefined,
    type: params.get('type') as PostTypes || undefined,
  };

  return Object.keys(args).reduce((acc, key) => {
    if (Array.isArray(args[key])) {
      acc[key] = args[key].filter((a) => a) as any;
    } else if (args[key] !== undefined) {
      acc[key] = args[key];
    }
    return acc;
  }, {} as PostsFilters);
};

const convertArray = <T>(arr?: string[]) => {
  arr = arr?.filter((a) => a) || [];
  return (arr?.length ? arr : undefined) as T[];
}