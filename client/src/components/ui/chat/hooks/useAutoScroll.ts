import { useEffect, useRef } from "react";

export function useAutoScroll(ref: React.RefObject<HTMLDivElement>) {
    const shouldScrollRef = useRef(true);
    const prevScrollHeightRef = useRef(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = element;
            // Check if user has scrolled up
            shouldScrollRef.current = scrollTop + clientHeight >= scrollHeight - 100;
            prevScrollHeightRef.current = scrollHeight;
        };

        element.addEventListener("scroll", handleScroll);
        return () => element.removeEventListener("scroll", handleScroll);
    }, [ref]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Only auto-scroll if we're at the bottom or new content was added
        if (shouldScrollRef.current || element.scrollHeight > prevScrollHeightRef.current) {
            element.scrollTop = element.scrollHeight;
            prevScrollHeightRef.current = element.scrollHeight;
        }
    }); // No dependencies to run on every render, like Svelte's $effect

    return null;
}