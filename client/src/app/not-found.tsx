'use client';

import { CLIENT_ROUTES } from '@/shared/constants/clientRoutes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import formStyles from '@/shared/styles/form.module.css';
import styles from './notFound.module.css';

function NotFoundPage() {
    const router = useRouter();

    return (
        <div className={styles.wrap}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.lead}>This route does not exist.</p>
            <div className={styles.row}>
                <Link className={`${formStyles.btnPrimary} ${styles.linkBtn}`} href={CLIENT_ROUTES.HOME}>
                    Home
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
