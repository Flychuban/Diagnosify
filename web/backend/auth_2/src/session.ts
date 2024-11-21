import { db } from "./db/db";

type Sessions = Record<string, string>
type TokenRecievedFromHeader = string // since we have stringgifed an object 
export type AuthToken = {
    hash: string,
    userId: number
}

const are_we_in_dev_mode = process.env.DEV || false



function generateHash() {
    return Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 10);  // 36^3 = 129,670,729 possible combinations, which is more than enough for our needs.
}
function generateToken(userId: number): AuthToken {

    return { hash: generateHash(), userId: userId };
}
export class SessionsManager{
    sessions: Sessions 
    constructor() {
        this.sessions = {}
    }

    async issueNewTokenForUser(username: string): Promise<AuthToken>{

        const userId = (await db.userRepo.getUser(username)).user?.id
        if (userId === null || userId === undefined) {
            
        throw new Error("user with username " + username + "doesn't exist")
        }
        const token = generateToken(userId)
        this.sessions[token.hash] = username
        return token
    }

    checkIfTokenBelongsToUser(token: AuthToken, username: string) {
        if (are_we_in_dev_mode && JSON.stringify(token).indexOf("auth") > 0) {
            return true
        }
        return this.sessions[token.hash] === username;
    }

    tokenExists(token: AuthToken): boolean {
        if (are_we_in_dev_mode && JSON.stringify(token).indexOf("auth") > 0) {
                return true
            }
        return (this.sessions[token.hash] !== "" && this.sessions[token.hash] !== undefined && this.sessions[token.hash] !== null) // a bit strabge but ut gives undefined but ts lsp thinks it only returns a string and there is never a mismatch anywhere
    }
}