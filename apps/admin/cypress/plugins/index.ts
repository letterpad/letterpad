/// <reference types="cypress" />
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const loadConfig = (on: any, _config: any) => {
  on("task", {
    async createSessionToken({ registerStep = "Registered", removeSettings = false } = {}) {
      const { PrismaClient } = require("@prisma/client");
      const { encode } = require("next-auth/jwt");
      const prisma = new PrismaClient();
      try {
        const author = await prisma.author.findUnique({
          where: { email: "demo@demo.com" },
          include: { role: true, membership: true },
        });
        if (!author) throw new Error("Cypress seed author demo@demo.com is missing");

        if (removeSettings) {
          await prisma.setting.deleteMany({ where: { author_id: author.id } });
        }
        if (registerStep) {
          await prisma.author.update({
            where: { id: author.id },
            data: { register_step: registerStep },
          });
        }

        return encode({
          token: {
            sub: author.id,
            id: author.id,
            email: author.email,
            name: author.name,
            username: author.username,
            avatar: author.avatar,
            role: author.role?.name ?? "AUTHOR",
            membership: author.membership?.status ?? "free",
            can_start_trial: !author.membership?.status,
            register_step: registerStep ?? author.register_step,
          },
          secret: process.env.SECRET_KEY,
          salt: "next-auth.session-token",
        });
      } finally {
        await prisma.$disconnect();
      }
    },
  });
};
export default loadConfig;
