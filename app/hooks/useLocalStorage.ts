import { useState } from 'react';

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (newValue: T) => void] {

    // Get from local storage then set to state
    const storedValue = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    const initial = storedValue ? safelyParseJSON(storedValue, initialValue) : initialValue;

    // Add this function to safely parse JSON
    function safelyParseJSON(json: string, fallback: T): T {
        try {
            return JSON.parse(json);
        } catch (e) {
            return fallback;
        }
    }

    const [value, setValue] = useState<T>(initial);


    // Set to local storage whenever [value] changes
    const setStoredValue = (newValue: T) => {
        try {
            const valueToStore = newValue;
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            setValue(JSON.parse(JSON.stringify(valueToStore)));
        } catch (error) {
            console.error(`Could not set localStorage for key "${key}":`, error);
        }
    };

    return [value, setStoredValue];
};

