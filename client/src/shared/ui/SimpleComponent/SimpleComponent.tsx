'use client';

import { useEffect, memo, useId } from "react";

// Props for SimpleComponent
type SimpleComponentProps = {
    text: string;
    memoFunc: () => void;
    factorial: number;
    number: number;
}

export function SimpleComponent({ text, number, memoFunc, factorial }: SimpleComponentProps) {
    console.log('Simple Component: Render');

    // Монтирование и размонтирование компонента
    useEffect(() => {
        console.log('Simple Component mounted');

        return () => {
            console.log('Simple Component unmounted');
        }
    }, []);

    return (
        <div onClick={memoFunc}>
            <h1>{text || 'Simple Component Text'}</h1>
            <h2>Factorial: {factorial}</h2>
            <h2>Number: {number}</h2>
        </div>
    );
}

export default memo(SimpleComponent);