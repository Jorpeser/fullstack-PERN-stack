import session, {Session, SessionData } from "express-session";
import { Request, Response } from "express";
import { Redis } from "ioredis";

export type MyContext = {
    req: Request & { session?: session.Session & Session & Partial<SessionData> & { userId: number}};
    res: Response;
    redis: Redis;
};