export interface User {
    userId: number;
    userName: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
}