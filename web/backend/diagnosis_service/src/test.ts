import { log } from "console";

export enum ResponseCodes { // TODO fix later if soie of the codes mismatch
  NOT_FOUND = 404,
  SERVER_DIED = 500,
  NOT_AUTH = 404 || 401, // auth for both authentication and authorization
  OK_WITH_RESPONSE = 200 || 201,
  OK_WITHOUT_RESPONSE = 204,
} // TODO if iit sbecomes to much create an enum that uses this enum for simple values like ok-ish (200 | 204)

export enum SimplifiedResponseCodes {
  OK_ish = ResponseCodes.OK_WITHOUT_RESPONSE || ResponseCodes.OK_WITH_RESPONSE,
}


console.log( 201 == ResponseCodes.OK_WITH_RESPONSE)
