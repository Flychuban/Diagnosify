import axios, { AxiosRequestConfig } from "axios";
import { AuthToken, cookies } from "../cookies";
import { env } from "~/env";
import { Env } from "../env";
import { Diagnosis } from "./types";
import { NewDiagnosisInfo } from "~/types/apiTypes";

export interface AuthResponse {
  token: string;
  success?: boolean;
  newUser?: { id: string };
}

export interface DiagnoseResponse {
  data: object;
}

export interface VoteResponse {
  success: boolean;
  message?: string;
}

export interface UserDiagnosesResponse {
  diagnoses: Diagnosis[];
}

function getAuthToken(): AuthToken | null | undefined {
  return cookies.token.get();
}

type RequestResponse<T> = T | { errMsg: string };

function getGatewayUrl(): string {
  return Env.gateway_url;
}

async function baseRequest<T>(reqObj: AxiosRequestConfig): Promise<RequestResponse<T>> {
  const token = getAuthToken();
  if (!reqObj.headers) {
    reqObj.headers = {};
  }

  if (token) {
    reqObj.headers.Authorization = `Bearer ${JSON.stringify(token)}`;
  }

  try {
    const result = await axios.request<T>(reqObj);
    return result.data;
  } catch (err) {
    return { errMsg: err.message };
  }
}

class Model {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = getGatewayUrl();
  }

  protected async request<T>(reqObj: AxiosRequestConfig): Promise<RequestResponse<T>> {
    reqObj.url = `${this.baseUrl}${reqObj.url}`;
    return baseRequest<T>(reqObj);
  }
}

class User extends Model {
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/auth/auth`;
  }

  async login(args: { username: string; password: string }): Promise<RequestResponse<{ token: AuthToken }>> {
    return this.request<{ token: AuthToken}>({
      method: "POST",
      url: "/login",
      data: { username: args.username, password: args.password },
    });
  }

  signup() {
    // Implement signup logic here
  }
}

class Diagnoses extends Model {
  public votings: { vote(diagnosisId: number, userId: number, vote: boolean): Promise<RequestResponse<{wasVotingSuccessful: boolean}>>}
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/diag/diag`;
    this.votings = {
      vote: (diagnosisId: number, userId: number, vote: boolean) => { 
        return this.request<{wasVotingSuccessful: boolean}>({
        method: "POST",
        url: `/diagnosis/${diagnosisId}/vote`,
        data: { userId , vote }, 
      })
      }
    }
  }

  async getAllDiagnoses(): Promise<RequestResponse<{ diagnoses: Diagnosis[] }>> {
    return this.request<{ diagnoses: Diagnosis[] }>({
      method: "GET",
      url: "/diagnosis/diagnoses",
    });
  }

  async getDiagnosis(id: string): Promise<RequestResponse<({
    voting: ({
        voters: {
            id: number;
            username: string;
        }[];
    } & {
        id: number;
        yes: number;
        no: number;
        diagnosisId: number;
    }) | null;
} & {
    id: number;
    type: string;
    userId: number;
    prediction: boolean;
    raw_data: string;
    is_correct: boolean | null;
}) | null>
> { 
    return this.request<({
    voting: ({
        voters: {
            id: number;
            username: string;
        }[];
    } & {
        id: number;
        yes: number;
        no: number;
        diagnosisId: number;
    }) | null;
} & {
    id: number;
    type: string;
    userId: number;
    prediction: boolean;
    raw_data: string;
    is_correct: boolean | null;
}) | null>({
      method: "GET",
      url: `/diagnosis/diagnoses/${id}`,
    });
  }


  async createDiagnosis(userId: string, info: NewDiagnosisInfo): Promise<RequestResponse<Diagnosis>> {
    return this.request<Diagnosis>({
      method: "POST",
      url: `/diagnosis/diagnoses/${userId}`,
      data: {...info },
    })
  }
}

class Api {
  public user = new User();
  public diagnoses = new Diagnoses();
}

export const api = new Api();
