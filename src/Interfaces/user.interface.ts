interface IUser {
    _id: string;

    nickname: string;
    phone?: number;

    email: string;
    username: string;

    password?: string; // optional now

    googleId?: string;
    authProvider: "local" | "google";

    profileImg: string;

    commentPost: string[];
    likePost: string[];
    savedPost: string[];

    refreshToken?: string;
    role: string;
    post: string[];

    createdAt: Date;
    updatedAt: Date;

    generateRefreshToken(): string;
    generateAccessToken(): string;
    isPasswordCorrect(password: string): Promise<boolean>;
}


export { IUser };