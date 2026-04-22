'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPostThunk } from '@/entities/post/api/apiPostThunk';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { showToast } from '@/shared/ui';
import formStyles from '@/shared/styles/form.module.css';
import styles from './PostForm.module.css';

const PostBodySchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(200, 'Title is too long'),
    content: z.string().trim().min(1, 'Content is required').max(8000, 'Content is too long'),
});

export type PostFormValues = z.infer<typeof PostBodySchema>;

export function PostForm(): React.JSX.Element {
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PostFormValues>({
        resolver: zodResolver(PostBodySchema),
        mode: 'onTouched',
        defaultValues: { title: '', content: '' },
    });

    const onSubmit = handleSubmit(async (values) => {
        try {
            await dispatch(createPostThunk(values)).unwrap();
            reset();
            showToast({ message: 'Post published', variant: 'success' });
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
    });

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>New post</h2>
            <p className={styles.hint}>Short title and body. You can edit or delete only your own posts.</p>
            <form onSubmit={onSubmit} noValidate>
                <div className={formStyles.field}>
                    <label className={formStyles.label} htmlFor="post-title">
                        Title
                    </label>
                    <input
                        id="post-title"
                        type="text"
                        autoComplete="off"
                        className={`${formStyles.input} ${errors.title ? formStyles.inputError : ''}`}
                        {...register('title')}
                    />
                    {errors.title ? <p className={formStyles.errorText}>{errors.title.message}</p> : null}
                </div>
                <div className={formStyles.field}>
                    <label className={formStyles.label} htmlFor="post-content">
                        Content
                    </label>
                    <textarea
                        id="post-content"
                        rows={5}
                        className={`${formStyles.textarea} ${errors.content ? formStyles.inputError : ''}`}
                        {...register('content')}
                    />
                    {errors.content ? <p className={formStyles.errorText}>{errors.content.message}</p> : null}
                </div>
                <div className={styles.actions}>
                    <button type="submit" className={formStyles.btnPrimary} disabled={isSubmitting}>
                        {isSubmitting ? 'Publishing…' : 'Publish'}
                    </button>
                </div>
            </form>
        </section>
    );
}
