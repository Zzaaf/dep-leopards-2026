// Импорт createAsyncThunk из redux toolkit
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { POSTS_API_ROUTES } from '@/shared/constants/postApiRoutes';
import { defaultRejectedAxiosError } from '@/shared/constants/defaultRejectedAxiosError';
import { ServerResponseType } from '@/shared/types';
import { AxiosError } from 'axios';
import { ArrayPostsType, IPost, IRawPostData } from '../model/types';

// Thunk для получения всех постов
export const getPostsThunk = createAsyncThunk<ArrayPostsType, void, { rejectValue: ServerResponseType }>(
    '***post/getPosts***', // action name
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<ServerResponseType<ArrayPostsType>>(POSTS_API_ROUTES.POSTS);
            const list = data.data;
            if (!Array.isArray(list)) {
                return [];
            }
            return list.filter((p): p is IPost => p != null && typeof p === 'object' && 'id' in p);
        } catch (error) {
            const axiosError = error as AxiosError<ServerResponseType>;
            if (!axiosError.response) {
                return rejectWithValue(defaultRejectedAxiosError);
            }
            return rejectWithValue(axiosError.response.data);
        }
    }
);

// Thunk для одного поста по id
export const getPostByIdThunk = createAsyncThunk<IPost, number, { rejectValue: ServerResponseType }>(
    '***post/getPostById***',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<ServerResponseType<IPost>>(`${POSTS_API_ROUTES.POSTS}/${id}`);
            if (data.statusCode === 200 && data.data) {
                return data.data;
            }
            throw new Error(data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ServerResponseType>;
            if (!axiosError.response) {
                return rejectWithValue(defaultRejectedAxiosError);
            }
            return rejectWithValue(axiosError.response.data);
        }
    }
);

// Thunk для удаления поста по id
export const deletePostByIdThunk = createAsyncThunk<number, number, { rejectValue: ServerResponseType }>(
    '***post/deletePostById***', // action name
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete<ServerResponseType<IPost>>(`${POSTS_API_ROUTES.POSTS}/${id}`);
            if (data.statusCode === 200) {
                return id;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ServerResponseType>;
            if (!axiosError.response) {
                return rejectWithValue(defaultRejectedAxiosError);
            }
            return rejectWithValue(axiosError.response.data);
        }
    }
);

// Thunk для создания поста
export const createPostThunk = createAsyncThunk<IPost, IRawPostData, { rejectValue: ServerResponseType }>(
    '***post/createPost***', // action name
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post<ServerResponseType<IPost>>(POSTS_API_ROUTES.POSTS, postData);
            if (data.statusCode === 201 && data.data) {
                return data.data;
            }
            throw new Error(data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ServerResponseType>;
            if (!axiosError.response) {
                return rejectWithValue(defaultRejectedAxiosError);
            }
            return rejectWithValue(axiosError.response.data);
        }
    }
);

// Thunk для обновления поста по id
export const updatePostByIdThunk = createAsyncThunk<IPost, { id: number; postData: IRawPostData }, { rejectValue: ServerResponseType }>(
    '***post/updatePostById***',
    async ({ id, postData }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put<ServerResponseType<IPost>>(`${POSTS_API_ROUTES.POSTS}/${id}`, postData);
            if (data.statusCode === 200 && data.data) {
                return data.data;
            }
            throw new Error(data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ServerResponseType>;
            if (!axiosError.response) {
                return rejectWithValue(defaultRejectedAxiosError);
            }
            return rejectWithValue(axiosError.response.data);
        }
    }
);
