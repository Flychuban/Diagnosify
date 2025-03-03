import axios  from 'axios';
import type { User } from "../types/api";
import { resolve } from 'bun';

interface IUserRepo{
    getUserPassword(username: string): Promise<string>
    getUser(user: string): Promise<{ user: User | null }>
} 
const gatewayUrl = process.env.MAIN_BACKEND_URL

class UserRepo implements IUserRepo{
    getUserPassword(username: string): Promise<string> {
        return new Promise((resolve) => {
          resolve("ExamplePassword")
        })
    }

    createUser(username: string, password: string) {
        // Implement logic to create a new user in the database
    }

    async getUser(username: string): Promise<{user: User | null} >{
        return {user: {username: "exampleDoctor", password: "ExamplePassword", id: "1"}} 
    }
}

export const userRepo: IUserRepo = new UserRepo(); 
