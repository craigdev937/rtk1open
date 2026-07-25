export interface JwtPayload {
    id: number,
    email: string
};

export interface IReg {
    id: number,
    first: string,
    last: string,
    email: string,
    password: string,
    created_at: string,
    updated_at: string
};

export interface ILog {
    id: number,
    email: string,
    password: string
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



