import { Session, User } from "next-auth";

interface IRegister {
    nama: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ILogin {
    email: string;
    password: string;
}

interface UserExtended extends User {
    accessToken?: string;
    status_user?: string;
    nama?: string;
}

interface SessionExtended extends Session {
    accessToken?: string;
    user?: UserExtended;
}

interface JWTExtended extends JWT {
    user?: UserExtended;
}

export type {IRegister, UserExtended, SessionExtended, JWTExtended, ILogin};