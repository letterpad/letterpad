import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const providers = [
  Providers.Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async credentials => {
      const user = {
        name: "Abhishek",
        accessToken: credentials.csrfToken,
      };

      if (user) {
        return user;
      } else {
        return null;
      }
    },
  }),
];

const callbacks = {
  // Getting the JWT token from API response
  async jwt(token, user) {
    if (user) {
      token.accessToken = user.accessToken;
    }

    return token;
  },

  async session(session, token) {
    session.accessToken = token.accessToken;
    return session;
  },
};

const options = {
  providers,
  callbacks,
};

export default (req, res) => NextAuth(req, res, options);
