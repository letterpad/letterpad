import { UnauthorizedError } from "./common";

const createResolver = resolver => {
  const baseResolver = resolver;
  baseResolver.createResolver = childResolver => {
    const newResolver = async (root, args, context, err) => {
      const newArgs = await resolver(root, args, context, err);
      return childResolver(root, newArgs, context, err);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requireLoggedIn = createResolver((root, args, context, err) => {
  if (context.error) {
    throw new UnauthorizedError({ error: context.error });
  }
  args = { ...args, _loggedIn: true };

  if (!context.user) {
    args = { ...args, _loggedIn: false };
  }
  return args;
});

export const requiresAuth = createResolver((root, args, context, err) => {
  if (!context.user || !context.user.id) {
    throw new UnauthorizedError({ url: err.fieldName });
  }
  return args;
});

export const requiresAdmin = requiresAuth.createResolver(
  (root, args, context, err) => {
    if (context.error) {
      throw new UnauthorizedError({ error: context.error });
    }
    if (!context.user.role == "ADMIN") {
      throw new UnauthorizedError({ url: err.fieldName });
    }
    return args;
  },
);

export const createPostsPerm = requiresAuth.createResolver(
  (root, args, context, err) => {
    var contains = ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"].filter(i =>
      context.user.permissions.includes(i),
    );
    if (contains.length == 0) {
      throw new UnauthorizedError({ url: err.fieldName });
    }
    return args;
  },
);
export const editPostPerm = requiresAuth.createResolver(
  (root, args, context) => {
    if (context.user.permissions.indexOf("MANAGE_OWN_POSTS") >= 0) {
      if (args.data) {
        args.data.authorId = context.user.id;
      } else {
        args.data = context.user.id;
      }
      return args;
    } else if (context.user.permissions.indexOf("MANAGE_ALL_POSTS") >= 0) {
      return args;
    }
    let operationName = "server";
    if (root.body && root.body.operationName) {
      operationName = root.body.operationName;
    }
    throw new UnauthorizedError({ url: operationName });
  },
);

export const checkDisplayAccess = createResolver((root, args, context, err) => {
  //  if this is enduser, he should see only public posts.
  if (!context.user || !context.user.id) {
    args.filters.status = "publish";
    return args;
  }

  if (context.error) {
    throw new UnauthorizedError({ url: err.fieldName });
  }
  //  Author should not see others posts from admin panel
  if (context.user.permissions.indexOf("MANAGE_OWN_POSTS") >= 0) {
    args.authorId = context.user.id;
    return args;
  } else if (
    context.user.permissions.indexOf("MANAGE_ALL_POSTS") >= 0 ||
    context.user.permissions.indexOf("READ_ONLY_POSTS") >= 0
  ) {
    return args;
  }
  throw new UnauthorizedError({ url: root.body.operationName });
});
