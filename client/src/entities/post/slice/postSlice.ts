import { createSlice } from '@reduxjs/toolkit';
import { getPostsThunk, createPostThunk, deletePostByIdThunk, updatePostByIdThunk } from '@/entities/post/api/apiPostThunk';
import { ArrayPostsType } from '@/entities/post/model/types';
import { ServerResponseType } from '@/shared/types';

// Типы статусов постов
type PostStatus = 'empty' | 'pending' | 'succeeded' | 'failed';

// Тип для состояния постов
type PostState = {
    posts: ArrayPostsType;
    status: PostStatus;
    lastError: ServerResponseType | null;
};

// Начальное состояние постов
const initialState: PostState = {
    posts: [],
    status: 'empty',
    lastError: null,
};

// Создание slice для постов
export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        // Синхронные действия
    },
    extraReducers: (builder) => {
        // Асинхронные действия
        builder
            // Получение всех постов
            .addCase(getPostsThunk.pending, (state) => {
                // Установка статуса в pending
                state.status = 'pending';
            })
            .addCase(getPostsThunk.fulfilled, (state, action) => {
                // Установка статуса в succeeded
                state.status = 'succeeded';
                // Установка постов
                state.posts = action.payload;
            })
            .addCase(getPostsThunk.rejected, (state, action) => {
                // Установка статуса в failed
                state.status = 'failed';
                // Установка последней ошибки
                state.lastError = action.payload ?? null;
            })
            // Создание поста
            .addCase(createPostThunk.pending, (state) => {
                // Установка статуса в pending
                state.status = 'pending';
            })
            .addCase(createPostThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload) {
                    state.posts = [...state.posts, action.payload];
                }
            })
            .addCase(createPostThunk.rejected, (state, action) => {
                // Установка статуса в failed
                state.status = 'failed';
                // Установка последней ошибки
                state.lastError = action.payload ?? null;
            })
            // Удаление поста по id
            .addCase(deletePostByIdThunk.pending, (state) => {
                // Установка статуса в pending
                state.status = 'pending';
            })
            .addCase(deletePostByIdThunk.fulfilled, (state, action) => {
                // Установка статуса в succeeded
                state.status = 'succeeded';
                // Удаление поста из массива
                state.posts = state.posts.filter((post) => post && post.id !== action.payload);
            })
            .addCase(deletePostByIdThunk.rejected, (state, action) => {
                // Установка статуса в failed
                state.status = 'failed';
                // Установка последней ошибки
                state.lastError = action.payload ?? null;
            })
            // Обновление поста
            .addCase(updatePostByIdThunk.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(updatePostByIdThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const next = action.payload;
                if (!next) return;
                state.posts = state.posts.map((post) => (post && post.id === next.id ? next : post));
            })
            .addCase(updatePostByIdThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.lastError = action.payload ?? null;
            })
    },
});

export const postReducer = postSlice.reducer;