import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { parseErrors } from "../../shared/util";
import { requiresAdmin } from "../utils/permissions";
import { getPermissions } from "../models/author";
import { error } from "util";
import config from "../../config";
import SendMail from "../utils/mail";
import { mailTemplate } from "../utils/common";

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
        login: async (
            root,
            { email, password, remember },
            { SECRET, models }
        ) => {
            const author = await models.Author.findOne({ where: { email } });

            if (!author) {
                return {
                    ok: false,
                    token: "",
                    errors: [
                        {
                            path: "Login",
                            message: "We couldnt find this email."
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
            const expiresIn = remember ? "30d" : "1d";

            const token = jwt.sign(
                {
                    email,
                    id: author.id,
                    role: role.name,
                    permissions: permissionNames,
                    name: author.fname,
                    expiresIn
                },
                SECRET,
                { expiresIn }
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
        ),
        createAuthor: requiresAdmin.createResolver(
            async (root, args, { models }) => {
                try {
                    const newArgs = { ...args };

                    const author = await models.Author.findOne({
                        where: { email: newArgs.email }
                    });
                    if (author) {
                        return {
                            ok: false,
                            errors: [
                                {
                                    message: "Email already exist",
                                    path: "createAuthor"
                                }
                            ]
                        };
                    }

                    const randomPassword = Math.random()
                        .toString(36)
                        .substr(2);
                    newArgs.password = await bcrypt.hash(randomPassword, 12);

                    await models.Author.create(newArgs, {
                        where: { id: newArgs.id }
                    });
                    const link = `${config.rootUrl}admin/login`;
                    const success = await SendMail({
                        to: newArgs.email,
                        subject: "Account Created",
                        body: mailTemplate({
                            name: newArgs.email,
                            body: `Your new account has been created!<br/>Login using your email and use the password ${randomPassword} at this link: <a href="${link}">${link}<a/>`
                        })
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
        ),
        forgotPassword: async (root, args, { models }) => {
            try {
                const email = args.email;
                const token = Math.random()
                    .toString(36)
                    .substr(2);
                const author = await models.Author.findOne({
                    where: { email }
                });
                if (!author) {
                    throw new Error("Email does not exist");
                }
                await models.Author.update(
                    { token },
                    { where: { id: author.id } }
                );
                const link = `${config.rootUrl}admin/reset-password`;
                const success = await SendMail({
                    to: email,
                    subject: "Password Reset",
                    body: mailTemplate({
                        name: author.fname,
                        body: `You asked us to reset your password for your account using the email address ${email}.<br/>If this was a mistake, or you didn't ask for a password reset, just ignore this email and nothing will happen.<br/>To reset your password, visit the following address: <a href="${link}">${link}<a/>`
                    })
                });

                return {
                    ok: true,
                    msg: "Check your email to recover your password"
                };
            } catch (e) {
                return {
                    ok: false,
                    msg: "Something unexpected happened"
                };
            }
        }
    },
    Author: {
        role: author => author.getRole()
    }
};
