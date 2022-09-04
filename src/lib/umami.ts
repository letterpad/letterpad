import { prisma } from "@/lib/prisma";

import { report } from "@/components/error";

function parseCookies(response) {
  const raw = response.headers.raw()["set-cookie"] || [];
  return raw
    .map((entry) => {
      const parts = entry.split(";");
      const cookiePart = parts[0];
      return cookiePart;
    })
    .join(";");
}

class Umami {
  username: string;
  password: string;
  website: string;
  url: string;
  resolution: string;
  cookies: string;
  endAt: number;
  startAt: number;
  token: string;

  constructor(config) {
    this.username = config.username;
    this.password = config.password;
    this.website = config.website;
    this.url = config.url;
    this.resolution = "day";
    this.cookies = "";
    this.token = "";

    const today = new Date();
    this.endAt = today.getTime();
    this.startAt = today.setDate(today.getDate() - 30);
  }

  async auth() {
    if (this.token !== "") return this;

    const req = await fetch(`${this.url}/api/auth/login`, {
      headers: {
        accept: "application/json",
        "content-type": "application/json; charset=UTF-8",
        cookie: "",
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
      method: "POST",
    });
    const res = await req.json();
    if (res) {
      this.token = (res as any).token;
    }
    this.cookies = parseCookies(req);

    return this;
  }

  async post(url, body = {}) {
    try {
      const req = await fetch(`${url}`, {
        headers: {
          accept: "application/json",
          "content-type": "application/json; charset=UTF-8",
          authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
        method: "POST",
      });
      const res = await req.json();
      return res;
    } catch (e) {
      console.log(e);
    }
  }

  async request(url) {
    const divider = url.includes("?") ? "&" : "?";
    const stats = await fetch(
      `${url}${divider}start_at=${this.startAt}&end_at=${this.endAt}`,
      {
        headers: {
          accept: "*/*",
          //   cookie: this.cookies,
          authorization: `Bearer ${this.token}`,
        },
        method: "GET",
      },
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));

    return stats;
  }

  setTimerange(days) {
    const today = new Date();
    this.endAt = today.getTime();
    this.startAt = today.setDate(today.getDate() - days);

    return this;
  }

  resolutionDay() {
    // umami is using this for the charts, groups the dataset
    this.resolution = "day";

    return this;
  }

  resolutionMonth() {
    // umami is using this for the charts, groups the dataset
    this.resolution = "month";

    return this;
  }

  last90Days() {
    this.setTimerange(90);

    return this;
  }

  last30Days() {
    this.setTimerange(30);

    return this;
  }

  last7Days() {
    this.setTimerange(7);

    return this;
  }

  last2Days() {
    this.setTimerange(2);
    return this;
  }

  yesterday() {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    today.setHours(0, 0, 0, 0);
    this.startAt = today.getTime();

    today.setHours(24, 0, 0, 0);
    this.endAt = today.getTime();
    return this;
  }

  today() {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    today.setHours(24, 0, 0, 0);
    this.startAt = today.getTime();
    this.endAt = new Date().getTime();
    return this;
  }

  customRange(startAt, endAt) {
    this.startAt = startAt;
    this.endAt = endAt;

    return this;
  }

  setWebsite(website) {
    this.website = website;

    return this;
  }

  async getStats() {
    return await this.request(`${this.url}/api/website/${this.website}/stats`);
  }

  async getChartPageviews() {
    return await this.request(
      `${this.url}/api/website/${this.website}/pageviews?unit=${this.resolution}&tz=Etc%2FUTC`,
    );
  }

  async getChartEvents() {
    return await this.request(
      `${this.url}/api/website/${this.website}/events?unit=${this.resolution}&tz=Etc%2FUTC`,
    );
  }

  async getEvents() {
    return await this.request(
      `${this.url}/api/website/${this.website}/metrics?type=event&tz=Etc%2FUTC`,
    );
  }

  async getUrls() {
    return await this.request(
      `${this.url}/api/website/${this.website}/metrics?type=url&tz=Etc%2FUTC`,
    );
  }

  async getReferrers() {
    return await this.request(
      `${this.url}/api/website/${this.website}/metrics?type=referrer&tz=Etc%2FUTC`,
    );
  }

  async getBrowsers() {
    return await this.request(
      `${this.url}/api/website/${this.website}/metrics?type=browser&tz=Etc%2FUTC`,
    );
  }

  async getOses() {
    return await this.request(
      `${this.url}/api/website/${this.website}/metrics?type=os&tz=Etc%2FUTC`,
    );
  }

  async getDevices() {
    return await this.request(
      `${this.url}/api/website/${this.website}/metrics?type=device&tz=Etc%2FUTC`,
    );
  }

  async getCountries() {
    return await this.request(
      `${this.url}/api/website/${this.website}/metrics?type=country&tz=Etc%2FUTC`,
    );
  }

  async addWebsite(name, domain) {
    return await this.post(`${this.url}/api/website`, {
      name,
      domain,
      public: false,
      enable_share_url: false,
    });
  }

  async changeWebsite(domain, website_id) {
    return await this.post(`${this.url}/api/website`, {
      website_id,
      domain,
    });
  }
}

async function umamiClient(config) {
  const instance = new Umami(config);
  await instance.auth();
  return instance;
}

export const umamiApi = (websiteId?: number) =>
  umamiClient({
    url: process.env.UMAMI_HOST,
    username: process.env.UMAMI_USERNAME,
    password: process.env.UMAMI_PASSWORD,
    website: websiteId,
  });

export const analytics_on =
  process.env.UMAMI_USERNAME &&
  process.env.UMAMI_PASSWORD &&
  process.env.UMAMI_HOST;

export const addUmamAnalyticsiIfNotExists = async (email: string) => {
  const author = await prisma.author.findFirst({
    where: { email },
    include: {
      role: true,
    },
  });

  if (author && !author.analytics_id && analytics_on) {
    try {
      const api = await umamiApi();
      const website = (await api.addWebsite(
        author.username,
        `${author.username}.letterpad.app`,
      )) as Record<string, any>;
      await prisma.author.update({
        data: {
          analytics_id: website.website_id,
          analytics_uuid: website.website_uuid,
        },
        where: {
          id: author.id,
        },
      });
    } catch (e) {
      report.error(e);
    }
  }
};
