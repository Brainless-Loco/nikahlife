import { Response } from "express";

export interface AuthTokens {
    accessToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Live এ true
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Live vs Local
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 দিন
            path: '/',
        });
    }
};
