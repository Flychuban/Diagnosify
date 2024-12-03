import { PasswordHasher } from './../../../../backend/auth/src/hasher';
import axios, { AxiosRequestConfig } from "axios";
import { AuthToken, cookies } from "../cookies";
import { env } from "~/env";
import { Env } from "../env";
import { Diagnosis, Voting } from "./types";
import { NewDiagnosisInfo } from "~/types/apiTypes";
import { FullChat } from '~/components/Chat';

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



export function getGatewayUrl(): string {
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

  console.log("headers",reqObj.headers["Authorization"], reqObj.headers["authorization"])

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

class Votings extends Model {
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/diag/diag/voting`;
  }
  async vote(votingId: number, userId: number, vote: boolean) {
    return this.request({
      method: "POST",
      url: `/${votingId}/vote`,
      data: { userId, vote },
    })
  }

  async get(chatId: number) {
    return this.request<{voting: Voting}>({
      method: "GET",
      url: `/chat/${chatId}`,
    });
  }


}

class Chat extends Model{
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/diag/diag/chat`;
  }

  get(diagnosisID: number) {
    return this.request<{ chat: FullChat  }>({
      method: "GET",
      url: `?diagnosisID=${diagnosisID}`,
    });
  }
  postMsg(chatId: number, userId: number, msg: string) {
    return this.request({
      method: "POST",
      url: `/${chatId}/message`,
      data: {
        message: msg,
        userId: userId,
      }
    })
  }

  replyToMsg(chatId: number, msgId: number, userId: number, msg: string) {
    return this.request({
      method: "POST",
      url: `/${chatId}/reply`,
      data: {
        userId: userId,
        idOfMsgWeAreReplyingTo: msgId,
        msgContent: msg,
      }
    })
  }
}

class Diagnoses extends Model {

  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/diag/diag`;
    
  }

  async createTextDataTextPredictionDiagnosis(data) {
    await axios.post(this.baseUrl, {
      method: "POST",
      url: ""
    })
  }

  async saveTextDataTextResponseDiagnosis(diseaseEndpoint: string, data: { responseMsg: { prediction: string }}, vote: boolean, voteWhichSkipsVoting: null | boolean ) {
    const s3Req = await axios.post<{ link_to_data_blob_which_holds_prediction_params: string }>(`${getGatewayUrl()}/data/data/${diseaseEndpoint}`, data, {
      headers: {
        "Authorization": "Bearer " + cookies.token.get()?.userId,
        "authorization": "Bearer " + cookies.token.get()?.userId
      }
    })

    const res = this.request<object>({
      method: "POST",
      url: `/diagnosis/user/${cookies.token.get()?.userId}/diagnoses`,
      data: {
        type: diseaseEndpoint,
        newDiagInfo: {
          type: diseaseEndpoint,
          link_raw_data: s3Req.data.link_to_data_blob_which_holds_prediction_params,
          label: data.responseMsg.prediction,
          vote: vote,
        },
        directVoteWhichSkipsVoting: voteWhichSkipsVoting
      }
    })
    return res;
  }

  async saveImageDataTextResponse(diseaseEndpoint: string, data: { prediction: string,file: File }, vote : boolean, voteWhichSkipsVoting: null | boolean) {
const authToken2 = cookies.token.get()
        if (authToken2 === null) {
          throw new Error("invalid token")
        }
        
        const formDdata = new FormData()
        formDdata.append("data", data.file)
    const s3uploadData = await axios.post<{ link_to_data_blob_which_holds_prediction_params: string }>(getGatewayUrl() + "/data/" + diseaseEndpoint, formDdata, {
          headers: {
            "Authorization": "Bearer " + cookies.token.get()?.userId,
            "authorization": "Bearer " + cookies.token.get()?.userId
          }
        })
        const res = await axios.post<object>(`${getGatewayUrl()}/diag/diag/diagnosis/user/${authToken2.userId}/diagnoses`, {
              newDiagInfo: {
                type: diseaseEndpoint,
                link_raw_data: s3uploadData.data.link_to_data_blob_which_holds_prediction_params,
                label: data.prediction,
                vote: vote
          },
          directVoeWhichSkipsVoting: voteWhichSkipsVoting
        },
          {
            headers: {
            "Authorization": "Bearer " + cookies.token.get()?.hash,
            "authorization": "Bearer " +cookies.token.get()?.hash 
          }
        })
            return res
  }

  async creatediagnosisAndSkipVoting(data): Promise<RequestResponse<{ wasVotingSuccessful: boolean }>>{

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

type MlPredictionResponse<T> = {
  prediction: T;
}

class ML extends Model {
  constructor() {
    super()
    this.baseUrl = `${this.baseUrl}/ml`
  }
 
  async cancerPrediction(imageFile: File): Promise<RequestResponse<{ prediction: { confidence: string, messsage: string } }>> {
    return (await axios.post<{ prediction: { confidence: string, messsage: string } }>(`${this.baseUrl}/pneummonia`,new FormData().append('file', imageFile))).data
  }

  async diabetesPrediction(data: {Pregnancies: string, Glucose: string, BloodPressure: string, 
        SkinThickness: string, Insulin: string, BMI: string, 
    DiabetesPedigreeFunction: string, Age: string
  }) {
    const res = await this.request<{ prediction: string }>({
      url: "/diabetes",
      method: "POST",
      data: data
    })
        }

  predict<T,V>(data: V,modelName: string) {
    const res = this.request<T>({
      method: "POST",
      url: `/${modelName}`,
      data: data
   }) 
  }


}

class Api {
  public user = new User();
  public diagnoses = new Diagnoses()
  public ml = new ML();
  public votings = new Votings()
  public chat = new Chat()
}

export const api = new Api();
