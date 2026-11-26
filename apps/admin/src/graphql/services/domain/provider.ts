export const usesManagedDomains = () =>
  process.env.LETTERPAD_DOMAIN_MODE === "managed";

export const managedDomainMessage =
  "Ask your Letterpad administrator to add, change, or remove a custom domain.";
