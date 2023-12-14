//Модель данных Post
export interface CommentsFromPost {
    commentId: number;
    commentText: string;
    commentWrittenAt: Date,
    commentVotes: number;
    userId: number;
    postId: number;
    userIdSub: string;
}