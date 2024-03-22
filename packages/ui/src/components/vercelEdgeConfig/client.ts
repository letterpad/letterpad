export const getEdgeConfigClient = () => {
    if (typeof window !== "undefined") return (window as any).edgeConfig as Record<string, any>;
    return null;
}