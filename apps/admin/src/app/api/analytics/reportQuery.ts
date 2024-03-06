
export const totalAll = (siteUrl: string) => ({
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
        filter: {
            fieldName: "pageLocation",
            stringFilter: {
                matchType: "BEGINS_WITH",
                value: new URL("", siteUrl)
            }
        }
    },
});
export const reportViewPerPage: any = (siteUrl: string) => ({
    dimensions: [
        {
            name: 'pagePath',
        },
        {
            name: 'pageTitle',
        },
    ],
    dimensionFilter: {
        filter: {
            fieldName: "pageLocation",
            stringFilter: {
                matchType: "BEGINS_WITH",
                value: new URL("/post", siteUrl)
            }
        }
    },
    metrics: [
        {
            name: 'sessions',
        },
        { name: 'userEngagementDuration' }
    ],
    limit: 100
})

export const reportViewPerPage1: any = (siteUrl: string) => ({
    dimensions: [
        {
            name: 'date',
        },
    ],
    dimensionFilter: {
        filter: {
            fieldName: "pageLocation",
            stringFilter: {
                matchType: "BEGINS_WITH",
                value: new URL("", siteUrl)
            }
        }
    },
    metrics: [
        {
            name: 'totalUsers',
        },
    ],
    limit: 30
})

export const reportReferral = (siteUrl: string) => ({
    dimensions: [
        {
            name: 'pageReferrer'
        },
    ],
    metrics: [
        {
            name: 'sessions'
        }
    ],
    dimensionFilter: {
        filter: {
            fieldName: "pageLocation",
            stringFilter: {
                matchType: "BEGINS_WITH",
                value: new URL("/post", siteUrl)
            }
        }
    },
    limit: 30
})

export const reportCountry = (siteUrl: string) => ({
    dimensions: [
        {
            name: 'country'
        },
    ],
    metrics: [
        {
            name: 'sessions'
        },
    ],
    dimensionFilter: {
        filter: {
            fieldName: "pageLocation",
            stringFilter: {
                matchType: "BEGINS_WITH",
                value: new URL("/post", siteUrl)
            }
        }
    },
    limit: 10
});


export const reportDevice = (siteUrl: string) => ({
    dimensions: [
        {
            name: 'deviceCategory'
        },
    ],
    metrics: [
        {
            name: 'sessions'
        },
    ],
    dimensionFilter: {
        filter: {
            fieldName: "pageLocation",
            stringFilter: {
                matchType: "BEGINS_WITH",
                value: new URL("", siteUrl)
            }
        }
    },
});
