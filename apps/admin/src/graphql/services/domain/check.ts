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

  /**
   * If domain is not verified, we try to verify now
   */
  let verificationResponse = null;
  if (!domainJson.verified) {
    const verificationRes = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}/verify?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    verificationResponse = await verificationRes.json();
  }

  if (domainResponse.status !== 200) {
    return domainJson;
  }
  return {
    configured: !configJson.misconfigured,
    ...domainJson,
  };
};
