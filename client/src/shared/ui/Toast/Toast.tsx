'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';

// Типы тостов
export type ToastVariant = 'success' | 'error';

// Типы опций тоста
export type ShowToastOptions = {
    message: string;
    variant?: ToastVariant;
    durationMs?: number;
};

// Тип тоста
type ToastItem = ShowToastOptions & { id: number };

// Колбэк для показа тоста
let emit: ((options: ShowToastOptions) => void) | null = null;

// Функция для показа тоста
export function showToast(options: ShowToastOptions): void {
    emit?.(options);
}

// Теги для тостов
const TAGS: Record<ToastVariant, string> = {
    success: 'OK',
    error: 'Error',
};

// Компонент для отображения тоста
function ToastItemView({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }): React.JSX.Element {
    const variant = item.variant ?? 'success';
    const cls = [styles.toast, variant === 'error' ? styles.error : styles.success].join(' ');

    return (
        <div className={cls} role="status">
            <span className={styles.tag}>{TAGS[variant]}</span>
            <p className={styles.message}>{item.message}</p>
            <button type="button" className={styles.dismiss} onClick={() => onDismiss(item.id)} aria-label="Close">
                ×
            </button>
        </div>
    );
}

// Компонент для предоставления тостов
export function ToastProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    const [items, setItems] = useState<ToastItem[]>([]);
    const [mounted, setMounted] = useState(false);
    const idRef = useRef(0);
    const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

    useEffect(() => {
        setMounted(true);
    }, []);

    const remove = useCallback((id: number) => {
        const t = timers.current.get(id);
        if (t) {
            clearTimeout(t);
            timers.current.delete(id);
        }
        setItems((prev) => prev.filter((x) => x.id !== id));
    }, []);

    const push = useCallback(
        (options: ShowToastOptions) => {
            const id = ++idRef.current;
            const durationMs = options.durationMs ?? 4800;
            const row: ToastItem = { ...options, id };
            setItems((prev) => [...prev, row]);
            if (durationMs > 0) {
                timers.current.set(id, setTimeout(() => remove(id), durationMs));
            }
        },
        [remove]
    );

    useEffect(() => {
        emit = push;
        return () => {
            emit = null;
        };
    }, [push]);

    return (
        <>
            {children}
            {mounted
                ? createPortal(
                      <div className={styles.region} aria-live="polite">
                          {items.map((item) => (
                              <ToastItemView key={item.id} item={item} onDismiss={remove} />
                          ))}
                      </div>,
                      document.body
                  )
                : null}
        </>
    );
}
