'use client';

import { type IPost } from '@/entities/post';
import { getPostByIdThunk } from '@/entities/post/api/apiPostThunk';
import { CLIENT_ROUTES } from '@/shared/constants/clientRoutes';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { showToast } from '@/shared/ui';
import type { ServerResponseType } from '@/shared/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './postDetail.module.css';


function formatDateTime(value: string | Date | undefined): string {
    if (value == null) return '—';
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

type LoadState = 'loading' | 'ready' | 'missing' | 'failed';

export default function PostDetailPage(): React.JSX.Element | null {
    const params = useParams();
    const id = Number(params.id);

    const dispatch = useAppDispatch();
    const [post, setPost] = useState<IPost | null>(null);
    const [loadState, setLoadState] = useState<LoadState>('loading');

    useEffect(() => {
        if (!Number.isFinite(id) || id < 1) {
            setLoadState('missing');
            return;
        }

        let cancelled = false;
        setLoadState('loading');

        dispatch(getPostByIdThunk(id))
            .unwrap()
            .then((data) => {
                if (!cancelled) {
                    setPost(data);
                    setLoadState('ready');
                }
            })
            .catch((error: unknown) => {
                const msg =
                    error && typeof error === 'object' && 'message' in error && typeof (error as { message: string }).message === 'string'
                        ? (error as { message: string }).message
                        : error instanceof Error
                            ? error.message
                            : 'Request failed';
                showToast({ message: msg, variant: 'error' });
                if (cancelled) return;
                setPost(null);
                const code =
                    error && typeof error === 'object' && 'statusCode' in error
                        ? (error as ServerResponseType).statusCode
                        : undefined;
                setLoadState(code === 404 ? 'missing' : 'failed');
            });

        return () => {
            cancelled = true;
        };
    }, [dispatch, id]);

    if (loadState === 'loading') {
        return <p className={styles.loading}>Loading…</p>;
    }

    if (loadState === 'missing') {
        return (
            <div>
                <Link href={CLIENT_ROUTES.POSTS} className={styles.back}>
                    ← Back to posts
                </Link>
                <h1 className={styles.missingTitle}>Post not found</h1>
                <p className={styles.missing}>Check the link or open the feed.</p>
            </div>
        );
    }

    if (loadState === 'failed') {
        return (
            <div>
                <Link href={CLIENT_ROUTES.POSTS} className={styles.back}>
                    ← Back to posts
                </Link>
                <h1 className={styles.missingTitle}>Could not load</h1>
                <p className={styles.missing}>Try again later or return to the list.</p>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <article>
            <Link href={CLIENT_ROUTES.POSTS} className={styles.back}>
                ← Back to posts
            </Link>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.meta}>
                id: {post.id} · author id: <span className={styles.metaAccent}>{post.user_id}</span>
            </p>
            <dl className={styles.dates}>
                <dt className={styles.dateLabel}>Created</dt>
                <dd className={styles.dateValue}>{formatDateTime(post.createdAt)}</dd>
                <dt className={styles.dateLabel}>Last updated</dt>
                <dd className={styles.dateValue}>{formatDateTime(post.updatedAt)}</dd>
            </dl>
            <p className={styles.body}>{post.content}</p>
        </article>
    );
}
