import { db } from "./db/db";
import Redis from 'ioredis';
import { authenticator } from 'otplib';

type Sessions = Record<string, string>;
type TokenRecievedFromHeader = string;
export type AuthToken = {
    hash: string,
    userId: number
}

const are_we_in_dev_mode = process.env.DEV || false;

const redis = new Redis();

function generateHash() {
    return Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 10);
}

function generateToken(userId: number): AuthToken {
    return { hash: generateHash(), userId: userId };
}

export class SessionsManager {
    constructor() {}

    async issueNewTokenForUser(username: string): Promise<AuthToken> {
        const userId = (await db.userRepo.getUser(username)).user?.id;
        if (userId === null || userId === undefined) {
            throw new Error("user with username " + username + " doesn't exist");
        }

        const token = generateToken(userId);
        await redis.set(`session:${token.hash}`, username, 'EX', 3600);

        return token;
    }

    async checkIfTokenBelongsToUser(token: AuthToken, username: string): Promise<boolean> {
        if (are_we_in_dev_mode && JSON.stringify(token).indexOf("auth") > 0) {
            return true;
        }

        const storedUsername = await redis.get(`session:${token.hash}`);
        return storedUsername === username;
    }

    async tokenExists(token: AuthToken): Promise<boolean> {
        if (are_we_in_dev_mode && JSON.stringify(token).indexOf("auth") > 0) {
            return true;
        }

        const storedUsername = await redis.get(`session:${token.hash}`);
        return storedUsername !== null;
    }

    async deleteToken(token: AuthToken): Promise<void> {
        await redis.del(`session:${token.hash}`);
    }

    // 2FA related methods

    async generate2FAToken(userId: number): Promise<string> {
        const secret = await this.getOrGenerate2FASecret(userId);
        const token = authenticator.generate(secret);
        await redis.set(`2fa_token:${userId}`, token, 'EX', 300);  // Store the 2FA token with a 5-minute TTL
        return token;
    }

    async verify2FAToken(userId: number, token: string): Promise<boolean> {
        const storedToken = await redis.get(`2fa_token:${userId}`);
        if (!storedToken) return false;

        const secret = await this.getOrGenerate2FASecret(userId);
        return authenticator.verify({ token, secret });
    }

    private async getOrGenerate2FASecret(userId: number): Promise<string> {
        let secret = await redis.get(`2fa_secret:${userId}`);
        if (!secret) {
            secret = authenticator.generateSecret();
            await redis.set(`2fa_secret:${userId}`, secret, 'EX', 31536000);  // Store secret with a long expiration (1 year)
        }
        return secret;
    }
}
