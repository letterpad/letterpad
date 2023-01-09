const domains: string[] = ["emailsementara.live"];

export const isBlackListed = (email: string) => {
  const domain = email.split("@")[1];
  return domains.includes(domain);
};
