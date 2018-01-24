import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { parseErrors } from "../../shared/util";
import { requiresAdmin } from "../utils/permissions";
import { getPermissions } from "../models/author";
import { error } from "util";

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
                    errors: [
                        {
                            path: "Login",
                            message:
                                "We couldnt find this email. Are you sure there is no typo ?"
                        }
                    ]
                };
            }
            const valid = await bcrypt.compare(password, author.password);

            if (!valid) {
                return {
                    ok: false,
                    token: "",
                    errors: [
                        {
                            path: "Login",
                            message: "We couldn't authenticate your credentials"
                        }
                    ]
                };
            }
            let role = await models.Role.findOne({
                where: { id: author.role_id }
            });
            const perms = await role.getPermissions();
            const permissionNames = perms.map(perm => perm.name); //test

            const token = jwt.sign(
                {
                    email,
                    id: author.id,
                    role: role.name,
                    permissions: permissionNames,
                    name: author.fname
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
            const author = { ...args };
            try {
                const user = await models.Author.findOne({
                    attributes: ["email"],
                    where: { email: author.email }
                });
                if (user) {
                    throw new Error("Email already exist");
                }

                author.password = await bcrypt.hash(author.password, 12);
                author.role_id = 1;
                console.log(author);
                const res = models.Author.create(author);

                return {
                    ok: true,
                    data: res,
                    errors: []
                };
            } catch (e) {
                return {
                    ok: false,
                    data: null,
                    errors: [{ message: e.message, path: "Register" }]
                };
            }
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
