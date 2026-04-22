'use client';

import { useCallback, useEffect, useLayoutEffect, useState, useMemo, useId } from 'react';
import MemoizedSimpleComponent from '@/shared/ui/SimpleComponent/SimpleComponent';

import styles from './page.module.css';

export default function Home() {

    const id = useId();

    console.log('ID: ', id);

    // Состояние для счетчика
    const [count, setCount] = useState(1);

    // Функция для обработки клика (передается в компонент SimpleComponent по ссылке)
    const unMemoFunc = (): void => {
        console.log('Simple Component clicked');
    }

    // Дорогое вычисление (например, факториал)
    const memoValue = useMemo(() => {
        console.log('Вычисляю факториал...');
        let result = 1;
        for (let i = 1; i <= 5; i += 1) {
            result *= i;
        }
        return result;
    }, []); // Пересчитывается только при изменении `number`

    // Мемоизированная функция 
    const memoFunc = useCallback(() => unMemoFunc(), []);

    useEffect(() => {
        console.log('Mount/Render: Home: Async operation');
        return () => {
            console.log('Unmount/Cleanup: Home: Async operation');
        };
    }, [count]);

    useLayoutEffect(() => {
        console.log('Mount/Render: Home: Sync operation');
        return () => {
            console.log('Unmount/Cleanup: Home: Sync operation');
        };
    }, [count]);

    return (
        <div className={styles.hero}>
            <h1 className={styles.title}>
                Home <span className={styles.accent}>//</span> lab
            </h1>
            <p className={styles.lead}>
                Minimal blog shell with monospace typography, RTK data layer, and forms wired through React Hook Form.
            </p>
            <button type="button" className={styles.counter} onClick={() => setCount((c) => c + 1)}>
                Render tick <span className={styles.counterVal}>{count}</span>
            </button>
            <MemoizedSimpleComponent text="Next.js 16" number={100} memoFunc={memoFunc} factorial={memoValue} />
        </div>
    );
}
