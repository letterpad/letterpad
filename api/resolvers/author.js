import { AuthorModel } from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { error } from "util";
import { parseErrors } from "../../shared/util";
import { RolePermissionModel } from "../models/rolePermission";
import { PermissionModel } from "../models/permission";
import { requiresAdmin } from "../utils/permissions";
import { getPermissions } from "../models/author";

export default {
    Query: {
        author: (root, args, context) => {
            return AuthorModel.findOne({ where: args });
        },
        authors: (root, args) => {
            return AuthorModel.findAll({ where: args });
        },
        me: (req, args, { user }) => {
            console.log(user);
            return AuthorModel.findOne({ where: { id: user.id } });
        }
    },
    Mutation: {
        login: async (root, { email, password }, { user, SECRET }) => {
            const author = await AuthorModel.findOne({ where: { email } });

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
            const role = await author.getRole({
                where: { id: author.role_id }
            });
            const permission_names = await getPermissions(role.id);

            let token = jwt.sign(
                {
                    email: email,
                    id: author.id,
                    role: role.name,
                    permissions: permission_names
                },
                SECRET,
                { expiresIn: "1y" }
            );
            return {
                ok: true,
                token: token,
                errors: []
            };
        },
        register: async (root, args) => {
            const author = args;
            author.password = await bcrypt.hash(author.password, 12);
            return AuthorModel.create(author);
        },
        updateAuthor: requiresAdmin.createResolver(
            async (root, args, context) => {
                try {
                    if (args.password) {
                        args.password = await bcrypt.hash(args.password, 12);
                    }
                    let update = await AuthorModel.update(args, {
                        where: { id: args.id }
                    });
                    return {
                        ok: true,
                        errors: []
                    };
                } catch (e) {
                    console.log(e);
                    return {
                        ok: false,
                        errors: parseErrors(e)
                    };
                }
            }
        )
    },
    Author: {
        role: author => {
            return author.getRole();
        }
    }
};
