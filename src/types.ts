export type User = {
    id: number,
    username: string,
    password: string,
    token: string
};

export type Category = {
    id: number,
    name: string
};

export type Product = {
    id: number,
    idCategory: number,
    name: string,
    price: number,
    description: string
};

export type Table = {
    id: number,
    code: number,
    state: boolean,
};

export type Bartender = {
    id: number,
    name: string,
    securityCode: string,
    token: string,
};