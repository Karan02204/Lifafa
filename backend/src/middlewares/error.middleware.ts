import type {  Request , Response , NextFunction } from "express";
import AppError from "../utils/app-error";

export function errorMiddleware(
    err  : Error,
    req  : Request,
    res  : Response,
    next : NextFunction
){
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    return res.status(500).json({
      success: false,
      // message: "Internal Server Error"
      message: err.message, // <-- temporary for debugging
      stack: err.stack, // <-- temporary for debugging
    });
}