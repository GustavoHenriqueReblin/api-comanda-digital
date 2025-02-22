import dotenv from "dotenv";

dotenv.config();

export const nextId = (data: any) => {
    return data.reduce((maxId: any, obj: any) => {
        return Math.max(maxId, obj.id);
    }, 0) + 1;
};