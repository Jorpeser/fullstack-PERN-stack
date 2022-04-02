import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import session, {Session, SessionData } from "express-session";
import { Request, Response } from "express";

export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>,
    req: Request & { session?: session.Session & Session & Partial<SessionData> & { userId: number}},
    res: Response
};