export const getAuthCookieName = () => {
  if (
    process.env.NEXT_PUBLIC_ROOT_URL &&
    new URL(process.env.NEXT_PUBLIC_ROOT_URL).protocol === "https:"
  ) {
    return "__Secure-next-auth.session-token";
  }
  return "next-auth.session-token";
};
