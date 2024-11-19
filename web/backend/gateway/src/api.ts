import axios, { AxiosRequestConfig } from "axios";
import { GatewayConfig } from "./types";
import { getConfig } from "./utils";

// a bit cringe code, wrote it a long time ago, idk why its a class when the two methods have nothing to do with each other,nor they operate on the same data and why is it even called api, TODO: rewrite later 
export class API {

    private config: GatewayConfig;
    constructor() {
        (async() => { this.config = await getConfig() })() // a bit gross byt we cant use async in the constructor directly
    }

  private getIndexAfterServiceName(subRoute: string): number {
    for (let i = 1; i < subRoute.length; i += 1) {
      if (subRoute[i] === '/') {
        return i;
      }
    }
    return subRoute.length;
  }
  public getServiceUrl(subRoute: string): string | null {
    const serviceName = subRoute.slice(
      1,
      this.getIndexAfterServiceName(subRoute),
    );
    const serviceUrl = this.config[serviceName]?.redirect_url || null

    console.log(serviceUrl)
    if (serviceUrl === null) {
      throw new Error("service")
    }


    return serviceUrl  // Use optional chaining and provide a default value
  }


  async sendReq(config: AxiosRequestConfig) {
    return axios(config);
  }
  
}
