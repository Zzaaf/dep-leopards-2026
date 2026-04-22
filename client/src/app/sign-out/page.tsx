'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch } from '@/shared/hooks';
import { signOutThunk } from '@/entities/user/api/apiUserThunk';
import { CLIENT_ROUTES } from '@/shared/constants/clientRoutes';
import { showToast } from '@/shared/ui';
import styles from './signOut.module.css';

export default function SignOutPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(signOutThunk())
            .unwrap()
            .then(() => {
                showToast({ message: 'Signed out', variant: 'success' });
                router.push(CLIENT_ROUTES.HOME);
            })
            .catch((error) => {
                showToast({
                    message:
                        error && typeof error === 'object' && 'message' in error && typeof (error as { message: string }).message === 'string'
                            ? (error as { message: string }).message
                            : error instanceof Error
                              ? error.message
                              : 'Request failed',
                    variant: 'error',
                });
                router.push(CLIENT_ROUTES.HOME);
            });
    }, [dispatch, router]);

    return <p className={styles.text}>Signing out…</p>;
}
