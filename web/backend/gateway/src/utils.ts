import dotenv from 'dotenv';
import { GatewayUrlEntry } from './types';
dotenv.config();





export function getSubroute(url: string): string { 
  
  return url.substring(url.substring(1,url.length).indexOf('/') + 1,url.length)
}

export function getConfig() : Promise<Record<string,GatewayUrlEntry>>{
    return (async () => {
    try {
        const { config } = await import("../src/config")
        return config;
    } catch (error) {
        const configStringified = process.env.CONFIG
        if (configStringified === undefined) {
            throw new Error('No config file found')
        }
        //TODO: refactor
        try {
            const config = JSON.parse(configStringified);
            return config
        } catch (error) { 
            console.error('Error parsing config:', error);
            throw new Error('Invalid config format')
        }
    }
})();

}

