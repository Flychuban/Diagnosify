import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "../cookies";
import { env } from "~/env";
import { Env } from "../env";
import { Diagnosis } from "./types";

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

function getAuthToken(): string | null | undefined {
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
    reqObj.headers.Authorization = `Bearer ${token}`;
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

  async login(args: { username: string; password: string }): Promise<RequestResponse<{ token: string }>> {
    return this.request<{ token: string }>({
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
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/diag/diagnoses`;
  }

  async getAllDiagnoses(): Promise<RequestResponse<{ diagnoses: Diagnosis[] }>> {
    return this.request<{ diagnoses: Diagnosis[] }>({
      method: "GET",
      url: "/diagnoses",
    });
  }
}

class Api {
  public user = new User();
  public diagnoses = new Diagnoses();
}

export const api = new Api();
