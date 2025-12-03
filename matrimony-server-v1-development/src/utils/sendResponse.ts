import { Response } from "express";
type TMeta = {
    limit: number;
    page: number;
    total: number;
    totalPage: number;
} | null;

export const sendResponse = <T>(
    res: Response,
    result: {
        statusCode: number;
        success: boolean;
        message: string;
        meta?: TMeta;
        data: T;
    }
) => {
    res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        meta: result.meta,
        data: result.data,
    })
}