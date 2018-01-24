import { UnauthorizedError } from "./common";

const createResolver = resolver => {
    const baseResolver = resolver;
    baseResolver.createResolver = childResolver => {
        const newResolver = async (root, args, context) => {
            const newArgs = await resolver(root, args, context);
            console.log("new args", newArgs);
            return childResolver(root, newArgs, context);
        };
        return createResolver(newResolver);
    };
    return baseResolver;
};

export const requiresAuth = createResolver((root, args, context) => {
    if (!context.user || !context.user.id) {
        console.log(root);
        let operationName = "server";
        if (root.body && root.body.operationName) {
            operationName = root.body.operationName;
        }
        throw new UnauthorizedError({ url: operationName });
    }
    return args;
});

export const requiresAdmin = requiresAuth.createResolver(
    (root, args, context) => {
        if (!context.user.role == "ADMIN") {
            let operationName = "server";
            if (root.body && root.body.operationName) {
                operationName = root.body.operationName;
            }
            throw new UnauthorizedError({ url: operationName });
        }
        return args;
    }
);

export const createPostsPerm = requiresAuth.createResolver(
    (root, args, context) => {
        var contains = ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"].filter(i =>
            context.user.permissions.includes(i)
        );
        if (contains.length == 0) {
            let operationName = "server";
            if (root.body && root.body.operationName) {
                operationName = root.body.operationName;
            }
            throw new UnauthorizedError({ url: operationName });
        }
        return args;
    }
);
export const editPostPerm = requiresAuth.createResolver(
    (root, args, context) => {
        if (context.user.permissions.indexOf("MANAGE_OWN_POSTS") >= 0) {
            args.author_id = context.user.id;
            return args;
        } else if (context.user.permissions.indexOf("MANAGE_ALL_POSTS") >= 0) {
            return args;
        }
        let operationName = "server";
        if (root.body && root.body.operationName) {
            operationName = root.body.operationName;
        }
        throw new UnauthorizedError({ url: operationName });
    }
);

export const checkDisplayAccess = createResolver((root, args, context) => {
    //  if this is enduser, he should see only public posts.
    if (!context.user || !context.user.id) {
        // if (args.status != "publish") {
        let operationName = "server";
        if (root.body && root.body.operationName) {
            operationName = root.body.operationName;
        }
        //     throw new UnauthorizedError({ url: operationName });
        // }
        args.status = "publish";
        return args;
    }
    //  Author should not see others posts from admin panel
    if (context.user.permissions.indexOf("MANAGE_OWN_POSTS") >= 0) {
        args.author_id = context.user.id;
        return args;
    } else if (
        context.user.permissions.indexOf("MANAGE_ALL_POSTS") >= 0 ||
        context.user.permissions.indexOf("READ_ONLY_POSTS") >= 0
    ) {
        return args;
    }
    console.log(root);
    throw new UnauthorizedError({ url: root.client.body.operationName });
});
