import { Request, Response } from "express";

export type GraphQLContext = {
    req: any;
    res: Response;
}

export type User = {
    id: number,
    name: string,
    email: string,
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
    isWaiting: boolean,
    isApproved: boolean,
};

export type OrderItems = {
    id: number,
    orderId: number,
    productId: number,
    value: number,
    status: number, // 0: Cancelado, 1: Confirmado
};

export type Order = {
    id: number,
    bartenderId: number,
    bertenderName: string,
    tableId: number,
    tableCode: number,
    value: number,
    date: Date,
    status: number, // 0: Concluído, 1: Resgatado, 2: Confirmado, 3: Finalizado, 4: Cancelado
    items: [OrderItems],
};