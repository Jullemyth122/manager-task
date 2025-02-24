import { useMemo } from 'react';

export const useSearchFilter = (data, searchTerm, keys) => {
    return useMemo(() => {
        if (!searchTerm) return data;
            const lowerSearchTerm = searchTerm.toLowerCase();
            return data.filter(item =>
            keys.some(key => {
                const value = item[key];
                return value && value.toString().toLowerCase().includes(lowerSearchTerm);
            })
        );
    }, [data, searchTerm, keys]);
};
