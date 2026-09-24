import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const listeners = new Set();
let intervalId = null;
let appStateSub = null;

const tick = () => {
    const now = Date.now();
    listeners.forEach((listener) => listener(now));
};

const startClock = () => {
    if (intervalId) return;
    intervalId = setInterval(tick, 30000);
    appStateSub = AppState.addEventListener('change', (state) => {
        if (state === 'active') tick();
    });
};

const stopClockIfIdle = () => {
    if (listeners.size > 0) return;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    if (appStateSub) {
        appStateSub.remove();
        appStateSub = null;
    }
};

export default function useNow(enabled = true) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!enabled) return undefined;
        const listener = (t) => setNow(t);
        listeners.add(listener);
        startClock();
        return () => {
            listeners.delete(listener);
            stopClockIfIdle();
        };
    }, [enabled]);

    return now;
}
