import { config } from './config';
import dotenv from 'dotenv';
import { GatewayConfig, GatewayUrlEntry } from './types';
dotenv.config();






export function getConfig() : Promise<Record<string,GatewayUrlEntry>>{
    return (async () => {
    try {
        const { config } = await import("../src/config")
        if (config === undefined) {
throw new Error("no config.ts file found")
        }
        return config;
    } catch (error) {
        const configStringified = process.env.CONFIG
        if (configStringified === undefined) {
            throw new Error('No config file found')
        }
        //TODO: refactor
        try {
            const config = JSON.parse(configStringified);
            console.log("loaded config "+ config + "from env")
            return config
        } catch (error) { 
            console.error('Error parsing config:', error);
            throw new Error('Invalid config format')
        }
    }
})();

}

// exprext inputs in the form of /<service_name>/someRoute/someRoute etc...
export function getServiceUrl(requestedUrl: string,config: GatewayConfig) {
    console.log(requestedUrl)
    const indexOfSecondSlash = requestedUrl.substring(1, requestedUrl.length).indexOf("/")
    
    const serviceName = requestedUrl.substring(1,indexOfSecondSlash + 1) // that way we get the service name

    console.log("!serviceUrl" + serviceName)
    
    const requestPath = requestedUrl.substring(indexOfSecondSlash+ 2, requestedUrl.length)

    const serviceUrl = config[serviceName].redirect_url;

    return `${serviceUrl}/${requestPath}`
}