import SendMail from "../utils/mail";

export default {
  Mutation: {
    sendMail: async (root, args, { models }) => {
      SendMail(args, (error, info) => {
        //...
      });
    },
  },
};
