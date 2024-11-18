export type GatewayUrlEntry = {
    redirect_url: string;
} 

export type GatewayConfig = Record<string,GatewayUrlEntry>