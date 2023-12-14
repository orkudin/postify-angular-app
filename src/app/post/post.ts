//Модель данных Post
export interface Post {
    postId: number;
    userId: number;
    userIdSub: string,
    postTitle: string;
    postDescription: string;
    postCreatedAt: string;
    urlImage: string;
    postVotes: number;
}