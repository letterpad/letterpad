import { protos } from '@google-analytics/data';

import { processMetricData, secondsToMinutes } from './helper';

type Query = Partial<protos.google.analytics.data.v1beta.RunReportRequest>
type Query1 = protos.google.analytics.data.v1beta.IRunReportResponse

export const totalAll = (siteUrl: string) => {
    const query: Query = {
        metrics: [
            {
                name: 'totalUsers',
            },
            {
                name: 'sessions',
            },
            {
                name: 'newUsers',
            },
            {
                name: 'userEngagementDuration',
            },
        ],
        dimensionFilter: {
            andGroup: {
                expressions: [
                    {
                        filter: {
                            stringFilter: {
                                value: new URL(siteUrl).host,
                                matchType: "EXACT"
                            },
                            fieldName: "hostName"

                        }
                    }
                ]
            }
        },
    };
    function parser(report: Query1, prevReport: Query1) {
        return {
            total: report?.rows?.map((row, index) => {
                const prev = prevReport?.rows?.[index]?.metricValues;
                const current = row.metricValues;

                function getValues(index: number) {
                    return processMetricData(current?.[index].value!, prev?.[index].value!);
                }

                const avgTime = getValues(3);
                return {
                    // "Users": getValues(0),
                    "Sessions": getValues(1),
                    "New Users": getValues(2),
                    "Avg. Time": {
                        ...avgTime,
                        value: secondsToMinutes(Number(avgTime.value ?? 0) / parseInt(row.metricValues?.[1].value ?? "0"))
                    },
                }
            }).pop() ?? null
        };
    }
    return { query, parser }
}
export const reportViewPerPage = (siteUrl: string) => {
    return {
        query: {
            dimensions: [
                {
                    name: 'pagePath',
                },
                {
                    name: 'pageTitle',
                },
            ],
            dimensionFilter: {
                andGroup: {
                    expressions: [
                        {
                            filter: {
                                stringFilter: {
                                    value: new URL(siteUrl).host,
                                    matchType: "EXACT"
                                },
                                fieldName: "hostName"

                            }
                        },
                        {
                            filter: {
                                fieldName: "pagePath",
                                stringFilter: {
                                    matchType: "BEGINS_WITH",
                                    value: '/post'
                                }
                            }
                        }
                    ]
                }
            },
            metrics: [
                {
                    name: 'sessions',
                },
                { name: 'userEngagementDuration' },
                { name: 'engagementRate' },
            ],
            limit: 100
        } as Query,
        parser: function processReportData(report: Query1) {
            return {
                data: report?.rows?.map(row => ({
                    pagePath: row.dimensionValues?.[0].value ?? "",
                    pageTitle: row.dimensionValues?.[1].value ?? "",
                    pageViews: parseInt(row.metricValues?.[0]?.value ?? "0"),
                    duration: parseInt(row.metricValues?.[1]?.value ?? "0"),
                    engagementRate: (parseFloat(row.metricValues?.[2]?.value ?? "0") * 100).toFixed(2) + "%",
                })) || []
            };
        }
    }
}

export const reportSessionPerDay = (siteUrl: string) => {
    return {
        query: {
            dimensions: [
                {
                    name: 'date',
                },
            ],
            dimensionFilter: {
                andGroup: {
                    expressions: [
                        {
                            filter: {
                                stringFilter: {
                                    value: new URL(siteUrl).host,
                                    matchType: "EXACT"
                                },
                                fieldName: "hostName"

                            }
                        },
                    ]
                }
            },
            metrics: [
                {
                    name: 'sessions',
                },
            ],
            limit: 30
        } as Query,
        parser: function processSessionPerDay(report: Query1) {
            return {
                sessionsPerDay: report?.rows?.map(row => ({
                    date: row.dimensionValues?.[0].value ?? "",
                    sessions: parseInt(row.metricValues?.[0]?.value ?? "0"),
                })) ?? []
            }
        }
    }
}

export const reportReferral = (siteUrl: string) => {
    return {
        query: {
            dimensions: [
                {
                    name: 'pageReferrer',
                },
            ],
            dimensionFilter: {
                filter: {
                    fieldName: "pageLocation",
                    stringFilter: {
                        matchType: "BEGINS_WITH",
                        value: new URL("/post", siteUrl).toString()
                    }
                }
            },
            metrics: [
                {
                    name: 'sessions',
                },
            ],
            limit: 10
        } as Query,
        parser: function processReferralData(report: Query1) {
            return {
                referals: report?.rows?.map(row => ({
                    referrer: row.dimensionValues?.[0].value ?? "Unknown",
                    sessions: parseInt(row.metricValues?.[0].value ?? "0")
                })) || []
            }
        }
    }

}

export const reportCountry = (siteUrl: string) => {
    return {
        query: {
            dimensions: [
                {
                    name: 'country',
                },
            ],
            dimensionFilter: {
                andGroup: {
                    expressions: [
                        {
                            filter: {
                                stringFilter: {
                                    value: new URL(siteUrl).host,
                                    matchType: "EXACT"
                                },
                                fieldName: "hostName"

                            }
                        }
                    ]
                }
            },
            metrics: [
                {
                    name: 'sessions',
                },
            ],
            limit: 10
        } as Query,
        parser: function processCountryData(report: Query1) {
            return {
                countries: report?.rows?.map(row => ({
                    country: row.dimensionValues?.[0].value ?? "",
                    sessions: parseInt(row.metricValues?.[0].value ?? "0")
                })) || []
            };
        }
    }
};

export const reportAllTimeReads = (siteUrl: string) => {
    return {
        query: {
            dimensionFilter: {
                andGroup: {
                    expressions: [
                        {
                            filter: {
                                stringFilter: {
                                    value: new URL(siteUrl).host,
                                    matchType: "EXACT"
                                },
                                fieldName: "hostName"

                            }
                        },
                        {
                            filter: {
                                stringFilter: {
                                    value: 'read',
                                    matchType: "EXACT"
                                },
                                fieldName: "eventName"

                            }
                        }
                    ]
                }
            },
            metrics: [
                {
                    name: 'sessions',
                },
            ]
        } as Query,
        parser: function processDeviceData(report: Query1) {
            return {
                allTimeReads: report?.rows?.map(row => ({
                    reads: parseInt(row.metricValues?.[0].value ?? "0"),
                })).pop()?.reads ?? 0
            };
        }
    }
}

export const reportReads = (siteUrl: string) => {
    return {
        query: {
            dimensions: [
                {
                    name: 'eventName',
                },
                {
                    name: 'pagePath',
                },
            ],
            dimensionFilter: {
                andGroup: {
                    expressions: [
                        {
                            filter: {
                                stringFilter: {
                                    value: new URL(siteUrl).host,
                                    matchType: "EXACT"
                                },
                                fieldName: "hostName"

                            }
                        },
                        {
                            filter: {
                                stringFilter: {
                                    value: 'read',
                                    matchType: "EXACT"
                                },
                                fieldName: "eventName"

                            }
                        }
                    ]
                }
            },
            metrics: [
                {
                    name: 'sessions',
                },
            ],
            limit: 10
        } as Query,
        parser: function processDeviceData(report: Query1) {
            return {
                reads: report?.rows?.map(row => ({
                    pagePath: row.dimensionValues?.[1].value ?? "",
                    reads: parseInt(row.metricValues?.[0].value ?? "0"),
                })) || []
            };
        }
    }

}

export const reportDevice = (siteUrl: string) => {
    return {
        query: {
            dimensions: [
                {
                    name: 'deviceCategory',
                },
            ],
            dimensionFilter: {
                andGroup: {
                    expressions: [
                        {
                            filter: {
                                stringFilter: {
                                    value: new URL(siteUrl).host,
                                    matchType: "EXACT"
                                },
                                fieldName: "hostName"

                            }
                        }
                    ]
                }
            },
            metrics: [
                {
                    name: 'sessions',
                },
            ],
            limit: 10
        } as Query,
        parser: function processDeviceData(report: Query1) {
            return {
                device: report?.rows?.map(row => ({
                    device: row.dimensionValues?.[0].value ?? "",
                    sessions: parseInt(row.metricValues?.[0].value ?? "0")
                })) || []
            };
        }
    }
};
