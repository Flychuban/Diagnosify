import Cookies from "js-cookie";
export type AuthToken = {
  hash: string,userId: number
}

class Cookie < T > {
  name: string;
  private customParser: (cookieString: string) => T
  private customSetter: (data: T) => string;

  /*
* {param} customParser is need since by default everything is saved as a string but we wouldnt want to reimplelemnt the logic everytime and we dont use json.Parse directly since there could be some more complex logic and we would like to happen in the cookie
*/ 
  constructor(name: string, customParser: (cookieString: string) => T,customSetter: (data: T) => string) {
    this.name = name;
    this.customParser = customParser;
    this.customSetter = customSetter
  }

  set(value: T): void { 
    const stringifiedValue = this.customSetter(value);
      Cookies.set(this.name,stringifiedValue);
  }

  get(): T | null {
    const sookieString = Cookies.get(this.name);
    if (sookieString === undefined) {
      return null
    }
    return this.customParser(sookieString)
  }
}

export const cookies = {
  token: new Cookie<AuthToken>("token", (cookieString: string) => { return JSON.parse(cookieString) }, (token) => {
    return JSON.stringify({hash: token.hash, userId: token.userId})
  }),
}





