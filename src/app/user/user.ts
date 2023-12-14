//Модель данных User
export interface User {
    userId: number;
    username: string;
    userPassword: string;
    userAbout: string;
    userProfileImg: string;
    userRole: string;
    userJoinedAt: Date;
    userStatus: string;
    userIdSub: string;
}