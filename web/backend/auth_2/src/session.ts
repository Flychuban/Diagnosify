
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
        const token = generateToken()
        this.sessions[token] = username
        return token
    }

    checkIfTokenBelongsToUser(token: Token, username: string) {
        return this.sessions[token] === username;
    }

    tokenExists(token: Token): boolean {
        return (this.sessions[token] !== "" && this.sessions[token] !== undefined && this.sessions[token] !== null) // a bit strabge but ut gives undefined but ts lsp thinks it only returns a string and there is never a mismatch anywhere
    }
}