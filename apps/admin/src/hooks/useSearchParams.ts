import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export const useNavigateWithParams = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const current = useMemo(() => new URLSearchParams(searchParams), [searchParams]);


    const updateParamsAndNavigate = useCallback((params: Record<string, any>) => {
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                current.delete(key); // Clear existing key before adding new values
                value.length
                    ? value.forEach(v => current.append(key, v.toString()))
                    : current.delete(key);
            } else {
                value ? current.set(key, value.toString()) : current.delete(key);
            }
        });
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    }, [current, pathname, router]);

    return useMemo(() => ({
        updateParamsAndNavigate,
        params: current
    }), [current, updateParamsAndNavigate]);
};