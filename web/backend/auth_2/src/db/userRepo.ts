interface IUserRepo{
    getUserPassword(username: string): string
} 

class UserRepo implements IUserRepo{
    getUserPassword(username: string): string {
        return "SamiPedal"
    }

    createUser(username: string, password: string) {
        // Implement logic to create a new user in the database
    }
}

export const userRepo: IUserRepo = new UserRepo(); 