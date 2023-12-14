//Модель данных Post
export interface PostWithUser {
    postId: number;
    userIdSub: string,
    postTitle: string;
    postDescription: string;
    postCreatedAt: string;
    urlImage: string;
    postVotes: number;
    state: string;

    userId: number;
    username: string;
    userProfileImg: string;
}