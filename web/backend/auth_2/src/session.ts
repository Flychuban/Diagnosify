
type Sessions = Record<string, string>
type Token = string
function generateToken(): Token {

        return Math.random().toString(36).substr(2, 10)
}
export class SessionsManager{
    sessions: Sessions 
    constructor() {
        this.sessions = {}
    }

    issueNewTokenForUser(username: string) {
        this.sessions[generateToken()] = username
    }

    checkIfTokenBelongsToUser(token: Token, username: string) {
        return this.sessions[token] === username;
    }

    tokenExists(token: Token): boolean {
        return (this.sessions[token] !== "")
    }
}