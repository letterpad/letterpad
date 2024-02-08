export const check = async (domain: string) => {
  const [configResponse, domainResponse] = await Promise.all([
    fetch(
      `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    ),
    fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    ),
  ]);

  const configJson = await configResponse.json();
  const domainJson = await domainResponse.json();
  // eslint-disable-next-line no-console
  console.log(configJson);
  // eslint-disable-next-line no-console
  console.log(domainJson);
  if (domainResponse.status !== 200) {
    return domainJson;
  }
  return {
    configured: !configJson.misconfigured,
    ...domainJson,
  };
};
