import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { parseErrors } from "../../shared/util";
import { requiresAdmin } from "../utils/permissions";
import { getPermissions } from "../models/author";

export default {
    Query: {
        author: (root, args, { models }) =>
            models.Author.findOne({ where: args }),
        authors: (root, args, { models }) =>
            models.Author.findAll({ where: args }),

        me: (req, args, { user, models }) =>
            models.Author.findOne({ where: { id: user.id } })
    },
    Mutation: {
        login: async (root, { email, password }, { SECRET, models }) => {
            const author = await models.Author.findOne({ where: { email } });

            if (!author) {
                return {
                    ok: false,
                    token: "",
                    errors: [{ path: "Login", message: "Email not found" }]
                };
            }
            const valid = await bcrypt.compare(password, author.password);

            if (!valid) {
                return {
                    ok: false,
                    token: "",
                    errors: [
                        { path: "Login", message: "Authentication Failed" }
                    ]
                };
            }
            let role = await models.Role.findOne({
                where: { id: author.role_id }
            });
            const perms = await role.getPermissions();
            const permissionNames = perms.map(perm => perm.name);
            // const role = await author.getRole({
            //     where: { id: author.role_id }
            // });
            //const permissionNames = await getPermissions(role.id);

            const token = jwt.sign(
                {
                    email,
                    id: author.id,
                    role: role.name,
                    permissions: permissionNames
                },
                SECRET,
                { expiresIn: "1y" }
            );
            return {
                ok: true,
                token,
                errors: []
            };
        },
        register: async (root, args, { models }) => {
            const author = args;
            author.password = await bcrypt.hash(author.password, 12);
            return models.Author.create(author);
        },
        updateAuthor: requiresAdmin.createResolver(
            async (root, args, { models }) => {
                try {
                    const newArgs = { ...args };
                    if (args.password) {
                        newArgs.password = await bcrypt.hash(args.password, 12);
                    }
                    await models.Author.update(newArgs, {
                        where: { id: newArgs.id }
                    });
                    return {
                        ok: true,
                        errors: []
                    };
                } catch (e) {
                    return {
                        ok: false,
                        errors: parseErrors(e)
                    };
                }
            }
        )
    },
    Author: {
        role: author => author.getRole()
    }
};
