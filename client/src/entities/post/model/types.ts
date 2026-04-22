// Типы данных для поста
export interface IRawPostData {
    title: string;
    content: string;
}

// Тип данных для поста с данными из базы данных
export interface IPost extends IRawPostData {
    id: number;
    user_id: number;
    createdAt: Date;
    updatedAt: Date;
}

// Тип для массива постов
export type ArrayPostsType = Array<IPost>;