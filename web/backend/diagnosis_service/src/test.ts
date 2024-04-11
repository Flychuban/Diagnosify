export const ResponseCodes = {
  NOT_FOUND: 404,
  SERVER_DIED: 500,
  NOT_AUTH: 401,
  OK_WITH_RESPONSE: 200,
  OK_WITH_CREATED_RESPONSE: 201,
  OK_WITHOUT_RESPONSE: 204,
} as const;

// Define a type for the possible values
type HttpStatusCode = typeof ResponseCodes[keyof typeof ResponseCodes];

// Define your simplified enum as an object with union types
export const SimplifiedResponseCodes = {
  OK_ish: ResponseCodes.OK_WITHOUT_RESPONSE,
  OK_WITH_RESPONSE_OR_CREATED: ResponseCodes.OK_WITH_RESPONSE || Response
