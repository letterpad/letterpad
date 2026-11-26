const reservedUsernames = new Set([
  "admin",
  "administrator",
  "api",
  "help",
  "login",
  "mail",
  "mod",
  "moderator",
  "posts",
  "register",
  "settings",
  "support",
  "update",
  "www",
]);

export const usernameMaxLength = 30;
export const usernameMinLength = 4;

export function usernameSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, usernameMaxLength)
    .replace(/-+$/g, "");
}

export function createUsernameSuggestion(
  name?: string | null,
  email?: string | null
) {
  const fromName = usernameSlug(name ?? "");
  const emailName = email?.split("@", 1)[0]?.split("+", 1)[0] ?? "";
  const fromEmail = usernameSlug(emailName);
  let suggestion =
    fromName.length >= usernameMinLength ? fromName : fromEmail;

  if (suggestion.length < usernameMinLength) suggestion = "new-writer";
  if (reservedUsernames.has(suggestion)) suggestion = `${suggestion}-writer`;

  return suggestion.slice(0, usernameMaxLength).replace(/-+$/g, "");
}

export function isLegacyGeneratedUsername(username?: string | null) {
  // Older onboarding generated six random Base64 characters from the email.
  return !!username && /^[a-z0-9+/]{6}$/i.test(username);
}
