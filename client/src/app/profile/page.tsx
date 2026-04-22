'use client';

import { useState } from 'react';
import styles from './profile.module.css';
import { useRouter } from 'next/navigation';
import { CLIENT_ROUTES } from '@/shared/constants/clientRoutes';
import { useAppSelector, useAppDispatch } from '@/shared/hooks';
import { deleteUserThunk } from '@/entities/user/api/apiUserThunk';
import { Modal, ModalActions, showToast } from '@/shared/ui';
import formStyles from '@/shared/styles/form.module.css';

export default function ProfilePage() {
    const { user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (!user) {
        return <p className={styles.notSigned}>Not signed in.</p>;
    }

    const performDelete = async (): Promise<void> => {
        try {
            await dispatch(deleteUserThunk(user.id)).unwrap();
            setConfirmOpen(false);
            showToast({ message: 'Account deleted', variant: 'success' });
            router.push(CLIENT_ROUTES.HOME);
        } catch (error) {
            showToast({
                message:
                    error && typeof error === 'object' && 'message' in error && typeof (error as { message: string }).message === 'string'
                        ? (error as { message: string }).message
                        : error instanceof Error
                          ? error.message
                          : 'Request failed',
                variant: 'error',
            });
        }
    };

    return (
        <>
            <h1 className={styles.pageTitle}>Profile</h1>
            <p className={styles.sub}>
                Signed in as <span className={styles.name}>{user.name}</span> — {user.email}
            </p>
            <div className={styles.actions}>
                <button type="button" className={formStyles.btnDanger} onClick={() => setConfirmOpen(true)}>
                    Delete account
                </button>
            </div>

            <Modal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Delete account"
                description="All your data and posts may be removed according to server rules. This action is irreversible."
                variant="danger"
            >
                <ModalActions>
                    <button type="button" className={formStyles.btnGhost} onClick={() => setConfirmOpen(false)}>
                        Cancel
                    </button>
                    <button type="button" className={formStyles.btnDanger} onClick={() => void performDelete()}>
                        Delete forever
                    </button>
                </ModalActions>
            </Modal>
        </>
    );
}
