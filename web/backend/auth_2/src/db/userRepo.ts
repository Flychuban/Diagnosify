import axios  from 'axios';
import type { User } from "../types/api";

interface IUserRepo{
    getUserPassword(username: string): Promise<string>
    getUser(user: string): Promise<{ user: User | null }>
} 
const gatewayUrl = process.env.MAIN_BACKEND_URL

class UserRepo implements IUserRepo{
    getUserPassword(username: string): Promise<string> {
        return "SamiPedal" as Promise<string>
    }

    createUser(username: string, password: string) {
        // Implement logic to create a new user in the database
    }

    async getUser(username: string): Promise<{user: User | null} >{
        return (await axios.get<{ user: User | null }>(`${gatewayUrl}/diag/user/${username}`)).data
    }
}

export const userRepo: IUserRepo = new UserRepo(); 