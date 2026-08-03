export type TTheme = "light" | "dark"

export interface ITheme {
    mode: TTheme
};

export interface IUser {
    id: number,
    first: string,
    last: string,
    email: string,
    password: string,
    created_at: string,
    updated_at: string
};

// What the API hands back about the signed in user.  The token
// itself lives in an httpOnly cookie, so it is never kept here.
export interface IAuthUser {
    id: number,
    email: string
};

export interface IData {
    success: boolean,
    message: string,
    count: number,
    data: IUser[]
};

// The envelope every single record endpoint responds with.
export interface IRes<Type> {
    success: boolean,
    message: string,
    data: Type
};

export interface IMsg {
    success: boolean,
    message: string
};

// POST /users/register -> the new row plus its token.
export interface IRegRes {
    success: boolean,
    message: string,
    data: {
        user: IUser,
        token: string
    }
};

// POST /users/login -> the token sits beside data, not inside it.
export interface ILogRes {
    success: boolean,
    message: string,
    data: IAuthUser,
    token: string
};

export interface UserState {
    user: IAuthUser | null,
    isAuth: boolean
};

export interface ITale {
    id: number,
    author_id: number,
    title: string,
    text: string,
    poster: string,
    views: number,
    created_at: string,
    updated_at: string
};

export interface ITData {
    success: boolean,
    message: string,
    count: number,
    data: ITale[]
};




