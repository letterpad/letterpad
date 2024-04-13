
import { ApiResponseData, ProcessedCountryData, ProcessedDeviceData, ProcessedMetricData, ProcessedReferralData, ProcessedReportData, ProcessedSessionsPerDayData, ProcessedTotalData, Row } from "../api/analytics/types";

const blogData = [
    { title: "The Power of Positive Thinking: Transform Your Life", slug: "the-power-of-positive-thinking-transform-your-life" },
    { title: "Effective Communication: Mastering the Art of Connection", slug: "effective-communication-mastering-the-art-of-connection" },
    { title: "Unlocking Your Creative Potential: Strategies for Success", slug: "unlocking-your-creative-potential-strategies-for-success" },
    { title: "Building Resilience: Overcoming Adversity with Grace", slug: "building-resilience-overcoming-adversity-with-grace" },
    { title: "Healthy Living Hacks: Small Changes, Big Impact", slug: "healthy-living-hacks-small-changes-big-impact" },
    { title: "Navigating Difficult Conversations: Tips for Success", slug: "navigating-difficult-conversations-tips-for-success" },
    { title: "Finding Balance in a Busy World: Prioritize Your Well-being", slug: "finding-balance-in-a-busy-world-prioritize-your-well-being" },
    { title: "Exploring the Benefits of Mindfulness Meditation", slug: "exploring-the-benefits-of-mindfulness-meditation" },
    { title: "Embracing Change: Thrive in Times of Transition", slug: "embracing-change-thrive-in-times-of-transition" },
    { title: "The Science Behind Habits That Stick", slug: "the-science-behind-habits-that-stick" },
    { title: "My Journey with Open Source and Its Impact on Platform Development", slug: "my-journey-with-open-source-and-its-impact-on-platform-development" },
    { title: "Chaining GraphQL Resolvers", slug: "chaining-graphql-resolvers" },
    { title: "Building a High-Performant Web Application in Edge Runtime", slug: "building-a-high-performant-app" },
    { title: "Calculate Visitor's Reading Time of Your Blog Article Effectively", slug: "calculate-reading-time-of-your-blog-article-effectively" },
    { title: "Migrating from Planetscale to Supabase with Automated Backups", slug: "migrating-from-planetscale-to-supabase" },
    { title: "Online and Offline Problems", slug: "online-and-offline-problems" },
    { title: "The Future of AI in Healthcare", slug: "the-future-of-ai-in-healthcare" },
    { title: "Demystifying Blockchain: Applications Beyond Cryptocurrency", slug: "demystifying-blockchain" },
    { title: "The Impact of Remote Work on Mental Health", slug: "the-impact-of-remote-work-on-mental-health" },
    { title: "Sustainable Living: Easy Eco-Friendly Practices for Everyday Life", slug: "sustainable-living-eco-friendly-practices" }
];

export function generateRandomData(): ApiResponseData {
    const data: ProcessedReportData[] = [];
    const referals: ProcessedReferralData[] = generateRandomReferralData();
    const countries: ProcessedCountryData[] = generateRandomCountryData();
    const sessionsPerDay: ProcessedSessionsPerDayData[] = generateRandomSessionsPerDayData();
    const device: ProcessedDeviceData[] = generateRandomDeviceData();
    const total: ProcessedTotalData = generateRandomTotalData();
    const reads: { pagePath: string; reads: number }[] = generateRandomReads();
    const allTimeReads: number = Math.floor(Math.random() * 100 + 2000);

    // Generate mock data for reports
    for (let i = 0; i < 10; i++) {
        data.push({
            pagePath: `/post/${blogData[i].slug}`,
            pageTitle: `${blogData[i].title}`,
            pageViews: Math.floor(Math.random() * 100),
            duration: Math.floor(Math.random() * 2000),
            engagementRate: `${Math.floor(Math.random() * 100)}%`,
            reads: Math.floor(Math.random() * 50),
        });
    }

    return { data, referals, countries, sessionsPerDay, device, total, reads, allTimeReads };
}

function generateRandomReferralData(): ProcessedReferralData[] {
    const referralSources = ['https://www.google.com/', 'https://www.reddit.com/', 'https://ajaxtown.com/', 'https://letterpad.app/', 'https://yandex.ru/', '', 'https://lens.google.com/'];
    const referals: ProcessedReferralData[] = [];
    for (const referrer of referralSources) {
        referals.push({
            referrer,
            sessions: Math.floor(Math.random() * 100),
        });
    }
    return referals;
}

function generateRandomCountryData(): ProcessedCountryData[] {
    const countrySessions: { [country: string]: number } = {};
    const countries: ProcessedCountryData[] = [];
    const countryNames = ['Germany', 'United States', 'Russia', 'Brazil', 'Italy', 'South Korea', 'France', 'India', 'Indonesia', 'Japan'];
    for (const country of countryNames) {
        const sessions = Math.floor(Math.random() * 100);
        countrySessions[country] = sessions;
    }
    for (const country in countrySessions) {
        if (countrySessions.hasOwnProperty(country)) {
            countries.push({ country, sessions: countrySessions[country] });
        }
    }
    return countries;
}

function generateRandomSessionsPerDayData(): ProcessedSessionsPerDayData[] {
    const sessionsPerDay: ProcessedSessionsPerDayData[] = [];
    const dates = ['20240401', '20240402',
        '20240403', '20240404', '20240405',
        '20240406', '20240407', '20240408', '20240409', '20240410', '20240411', '20240412', '20240413', '20240414'];
    for (const date of dates) {
        sessionsPerDay.push({
            date,
            sessions: Math.floor(Math.random() * 30 + 10),
        });
    }
    return sessionsPerDay;
}

function generateRandomDeviceData(): ProcessedDeviceData[] {
    return [{ device: 'desktop', sessions: Math.floor(Math.random() * 100) }, { device: 'mobile', sessions: Math.floor(Math.random() * 100) }];
}

function generateRandomTotalData(): ProcessedTotalData {
    return {
        Sessions: generateRandomMetricData(),
        "New Users": generateRandomMetricData(),
        "Avg. Time": generateRandomMetricData(),
    };
}

function generateRandomMetricData(): ProcessedMetricData {
    return {
        value: Math.floor(Math.random() * 250 + 100),
        prevValue: Math.floor(Math.random() * 100 + 50),
        diff: Math.floor(Math.random() * 200 + 100),
        percentage: Math.floor(Math.random() * 100 + 5),
        positive: Math.random() < 0.5,
    };
}

function generateRandomReads(): { pagePath: string; reads: number }[] {
    const reads: { pagePath: string; reads: number }[] = [];
    for (let i = 0; i < 10; i++) {
        reads.push({
            pagePath: `/post/migrating-from-planetscale-to-supabase`,
            reads: Math.floor(Math.random() * 250),
        });
    }
    return reads;
}

export const testData: ApiResponseData = generateRandomData();



