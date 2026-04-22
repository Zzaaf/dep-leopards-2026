'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

// Типы вариантов модального окна
export type ModalVariant = 'default' | 'danger';

// Типы пропсов модального окна
export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
    variant?: ModalVariant;
    closeOnOverlayClick?: boolean;
};

// Компонент для предоставления действий в модальном окне
export function ModalActions({ children }: { children: React.ReactNode }): React.JSX.Element {
    return <div className={styles.actions}>{children}</div>;
}

// Компонент для отображения модального окна
export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    variant = 'default',
    closeOnOverlayClick = true,
}: ModalProps): React.JSX.Element | null {
    // Состояние монтирования компонента
    const [mounted, setMounted] = useState(false);

    // Монтирование компонента
    useEffect(() => {
        setMounted(true);
    }, []);

    // Обработка нажатия клавиши Escape
    useEffect(() => {
        if (!isOpen) {
            return;
        }
        const onKeyDown = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) {
        return null;
    }

    const overlayClass = [styles.overlay, variant === 'danger' ? styles.variantDanger : ''].filter(Boolean).join(' ');

    const handleOverlayPointerDown = (e: React.MouseEvent): void => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };

    return createPortal(
        <div
            className={overlayClass}
            role="presentation"
            onMouseDown={handleOverlayPointerDown}
            aria-hidden={!isOpen}
        >
            <div
                className={styles.dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className={styles.headerRow}>
                    <h2 id="modal-title" className={styles.title}>
                        {title}
                    </h2>
                    <button type="button" className={styles.close} onClick={onClose} aria-label="Close dialog">
                        ×
                    </button>
                </div>
                {description ? <p className={styles.description}>{description}</p> : null}
                {children}
            </div>
        </div>,
        document.body
    );
}