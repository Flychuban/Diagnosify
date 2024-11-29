// why we need this :
// i have a super strange bug where a page is rerenderd every time and it causes performance issues for when we send requests so i introduce a proxy to use 

export enum Statuses{
    BUSY
}

class Proxy{
    private lastExecutionTime = Date.now()
    constructor(){}
    async send<T>(funcToExecute: () => Promise<T>): Promise<T | Statuses> {
        const currentTime = Date.now();
        if (currentTime - this.lastExecutionTime < 5000) {
 
           return Statuses.BUSY;
        }
        this.lastExecutionTime = currentTime;
        console.log("making req")
        return await funcToExecute()
    }
}


export const timelimitedProxy = new Proxy();