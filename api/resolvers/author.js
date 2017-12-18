import { AuthorModel } from "../models";

export default {
    Query: {
        author: (root, args) => {
            return AuthorModel.findOne({ where: args });
        },
        authors: (root, args) => {
            return AuthorModel.findAll({ where: args });
        }
    },
    Author: {
        role: author => {
            return author.getRole();
        }
    }
};
