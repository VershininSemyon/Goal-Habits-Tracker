import { useCallback, useEffect, useState } from "react";

export function useToast() {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const handler = (event) => setToast(event.detail);
        window.addEventListener("showToast", handler);
        return () => window.removeEventListener("showToast", handler);
    }, []);

    const hideToast = useCallback(() => setToast(null), []);
    return { toast, hideToast };
}
