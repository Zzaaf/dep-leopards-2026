'use client';

import { PostForm, PostList } from '@/widgets';
import styles from './post.module.css';
import { useAppSelector } from '@/shared/hooks';

function PostsPage() {
    // Получаем пользователя из Redux-store
    const { user } = useAppSelector((state) => state.user);

    // Если пользователь не авторизован, то выводим сообщение
    if (!user) {
        return <p className={styles.notSigned}>Not signed in.</p>;
    }

    // Если пользователь авторизован, то выводим список постов
    return (
        <>
            <h1 className={styles.title}>Posts</h1>
            <p className={styles.lead}>
                Authenticated feed: create posts, edit or delete only what you authored. Everyone sees the same list.
            </p>
            <PostForm />
            <PostList />
        </>
    );
}

export default PostsPage;
