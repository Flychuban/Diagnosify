import axios from "axios";

export class Api {
  private static url = "http://localhost:7000";

  private static async authenticate(
    url: string,
    data: { username: string; password: string },
  ) {
    try {
      const response = await axios({
        url,
        data,
        method: "POST",
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  static async login(data: {
    username: string;
    password: string;
  }): Promise<{ token: string }> {
    return await this.authenticate(`${this.url}/auth/login`, data);
  }

  static async signup(data: { username: string; password: string }) {
    const response = await this.authenticate(`${this.url}/auth/signup`, data);
    console.log(response);
    if (!response.success) {
      return;
    }
    console.log("hijjih");
    return await axios.post(`${this.url}/diag/user/new`, {
      username: data.username,
      userId: response.newUser.id,
    });
  }

  static async sendDiagnose(diagnose: object) {
    //for ml seervice
    console.log("jijijijijijiji", diagnose);
    return await axios.post(`${this.url}/ml/${diagnose.type}`, {
      data: { ...diagnose },
    });
  }

  static async getUserDignoses(username: string) {
    return await axios.get(`${this.url}/diag/${username}`);
  }

  static async getAllDiagnoses() {
    return await axios.get(`${this.url}/diag/diagnoses`);
  }

  static async getReading(id: number) {
    return await axios.get(`${this.url}/diag/diagnoses/${id}`);
  }

  static async createDiagnosis(userId: string, data: object) {
    return await axios.post(`${this.url}/diag/user/${userId}/diagnoses`, data);
  }

  static async VoteForDiagnosis(
    userId: number,
    diagnosisId: number,
    vote: boolean,
  ) {
    try {
      return await axios.post(
        `${this.url}/diag/diagnoses/${diagnosisId}/vote`, // make the endpoint on the server
        {
          vote: vote,
          userId: userId,
        },
      );
    } catch (e) {
      return {
        e: e,
      };
    }
  }
}
