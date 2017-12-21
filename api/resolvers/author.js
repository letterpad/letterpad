import { AuthorModel } from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { error } from "util";

export default {
    Query: {
        author: (root, args) => {
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

            let token = jwt.sign(
                {
                    email: email,
                    id: author.id,
                    role: author.role
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
        }
    },
    Author: {
        role: author => {
            return author.getRole();
        }
    }
};
