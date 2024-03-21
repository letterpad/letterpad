import { getAll } from '@vercel/edge-config';

const maintainanceModeKey =
    process.env.NODE_ENV === 'production'
        ? 'isInMaintenanceMode'
        : 'isInMaintenanceModeDev';


const createGetEdgeConfig = () => {
    let cache: Record<string, any> = {};

    return {
        byKey: async <T>(key: string) => {
            if (cache[key]) {
                return cache[key] as T;
            }
            if (process.env.EDGE_CONFIG) {
                const records = await getAll();
                cache = records;
                return records[key] as T;
            }

            return null;
        },
        all: async () => {
            if (Object.keys(cache).length > 0)
                return cache;

            if (process.env.EDGE_CONFIG) {
                const records = await getAll();
                cache = records;
                return cache;
            }
        }
    }
};

export const getEdgeConfig = createGetEdgeConfig();


export const isInMaintenanceModeEnabled = async () => {
    return await getEdgeConfig.byKey<boolean>(maintainanceModeKey)
}
export const isPaymentsEnabled = async () => {
    return await getEdgeConfig.byKey<boolean>('isPaymentsEnabled')
}