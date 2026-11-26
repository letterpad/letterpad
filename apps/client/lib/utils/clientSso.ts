export function startClientSso(interactive: boolean) {
  const returnTo =
    window.location.pathname + window.location.search + window.location.hash;
  const params = new URLSearchParams({
    return: returnTo,
    interactive: interactive ? '1' : '0',
  });
  window.location.assign(`/api/sso/start?${params}`);
}

export async function signOutClient() {
  const response = await fetch('/api/sso/logout', { method: 'POST' });
  if (response.ok) window.location.reload();
}
