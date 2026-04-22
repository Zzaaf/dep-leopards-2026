'use client';

import { type IPost } from '@/entities/post';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useAppSelector } from '@/shared/hooks/useAppSelector';
import { deletePostByIdThunk, getPostsThunk, updatePostByIdThunk } from '@/entities/post/api/apiPostThunk';
import { CLIENT_ROUTES } from '@/shared/constants/clientRoutes';
import Link from 'next/link';
import { Modal, ModalActions, showToast } from '@/shared/ui';
import formStyles from '@/shared/styles/form.module.css';
import styles from './PostList.module.css';

const PREVIEW_MAX_WORDS = 25;

function errorText(err: unknown): string {
    if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
        const m = (err as { message: string }).message;
        if (m.length > 0) return m;
    }
    if (err instanceof Error && err.message.length > 0) return err.message;
    return 'Request failed';
}

function previewContent(text: string): string {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length <= PREVIEW_MAX_WORDS) {
        return text.trim();
    }
    return `${words.slice(0, PREVIEW_MAX_WORDS).join(' ')}...`;
}

const EditSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
    content: z.string().trim().min(1, 'Content is required').max(8000, 'Content is too long'),
});

type EditValues = z.infer<typeof EditSchema>;

function isPost(value: unknown): value is IPost {
    return value != null && typeof value === 'object' && 'id' in value && 'title' in value;
}

export function PostList(): React.JSX.Element {
    const { posts } = useAppSelector((state) => state.post);
    const validPosts = posts.filter(isPost);
    const { user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const [deleteTarget, setDeleteTarget] = useState<IPost | null>(null);
    const [editTarget, setEditTarget] = useState<IPost | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EditValues>({
        resolver: zodResolver(EditSchema),
        mode: 'onTouched',
        defaultValues: { title: '', content: '' },
    });

    useEffect(() => {
        dispatch(getPostsThunk())
            .unwrap()
            .catch((error) => {
                showToast({ message: errorText(error), variant: 'error' });
            });
    }, [dispatch]);

    useEffect(() => {
        if (editTarget) {
            reset({ title: editTarget.title, content: editTarget.content });
        }
    }, [editTarget, reset]);

    const confirmDelete = async (): Promise<void> => {
        if (!deleteTarget) return;
        try {
            await dispatch(deletePostByIdThunk(deleteTarget.id)).unwrap();
            setDeleteTarget(null);
            showToast({ message: 'Post removed', variant: 'success' });
        } catch (error) {
            showToast({ message: errorText(error), variant: 'error' });
        }
    };

    const onEditSubmit = handleSubmit(async (values) => {
        if (!editTarget) return;
        try {
            await dispatch(updatePostByIdThunk({ id: editTarget.id, postData: values })).unwrap();
            setEditTarget(null);
            showToast({ message: 'Post updated', variant: 'success' });
        } catch (error) {
            showToast({ message: errorText(error), variant: 'error' });
        }
    });

    const isAuthor = (post: IPost): boolean => !!user && Number(post.user_id) === Number(user.id);

    return (
        <section className={styles.section}>
            <h2 className={styles.subtitle}>Feed</h2>
            {validPosts.length > 0 ? (
                <ul className={styles.list}>
                    {validPosts.map((post) => (
                        <li key={post.id} className={styles.card}>
                            <div className={styles.cardRow}>
                                <Link href={CLIENT_ROUTES.POST_DETAIL(post.id)} className={styles.cardMain}>
                                    <h3 className={styles.cardTitle}>{post.title}</h3>
                                    <p className={styles.meta}>
                                        author id: {post.user_id}
                                        {isAuthor(post) ? <span className={styles.metaYou}> — you</span> : null}
                                    </p>
                                    <p className={styles.content}>{previewContent(post.content)}</p>
                                </Link>
                                {isAuthor(post) ? (
                                    <div className={styles.actions}>
                                        <button
                                            type="button"
                                            className={`${formStyles.btnGhost} ${formStyles.btnSmall}`}
                                            onClick={() => setEditTarget(post)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className={`${formStyles.btnDanger} ${formStyles.btnSmall}`}
                                            onClick={() => setDeleteTarget(post)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.empty}>No posts yet. Create the first one above.</p>
            )}

            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete post"
                description="This cannot be undone. The post will be permanently removed."
                variant="danger"
            >
                <ModalActions>
                    <button type="button" className={formStyles.btnGhost} onClick={() => setDeleteTarget(null)}>
                        Cancel
                    </button>
                    <button type="button" className={formStyles.btnDanger} onClick={() => void confirmDelete()}>
                        Delete
                    </button>
                </ModalActions>
            </Modal>

            <Modal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                title="Edit post"
                description="Only you can change this post. Save when you are done."
            >
                <form onSubmit={onEditSubmit} noValidate>
                    <div className={formStyles.field}>
                        <label className={formStyles.label} htmlFor={`edit-title-${editTarget?.id ?? 0}`}>
                            Title
                        </label>
                        <input
                            id={`edit-title-${editTarget?.id ?? 0}`}
                            type="text"
                            className={`${formStyles.input} ${errors.title ? formStyles.inputError : ''}`}
                            {...register('title')}
                        />
                        {errors.title ? <p className={formStyles.errorText}>{errors.title.message}</p> : null}
                    </div>
                    <div className={formStyles.field}>
                        <label className={formStyles.label} htmlFor={`edit-content-${editTarget?.id ?? 0}`}>
                            Content
                        </label>
                        <textarea
                            id={`edit-content-${editTarget?.id ?? 0}`}
                            rows={5}
                            className={`${formStyles.textarea} ${errors.content ? formStyles.inputError : ''}`}
                            {...register('content')}
                        />
                        {errors.content ? <p className={formStyles.errorText}>{errors.content.message}</p> : null}
                    </div>
                    <ModalActions>
                        <button type="button" className={formStyles.btnGhost} onClick={() => setEditTarget(null)}>
                            Cancel
                        </button>
                        <button type="submit" className={formStyles.btnPrimary} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving…' : 'Save'}
                        </button>
                    </ModalActions>
                </form>
            </Modal>
        </section>
    );
}
