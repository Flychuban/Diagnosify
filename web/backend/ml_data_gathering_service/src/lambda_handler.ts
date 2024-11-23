import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Define the File interface since it's not available in Node.js runtime
interface File {
  buffer: Buffer;
  name: string;
  type: string;
  size: number;
}

// Define the expected input type
interface PredictionRequest {
  raw_data: Record<string, File | number>;
  prediction: true;
  is_correct: boolean;
}

// Type guard to check if a value is a File
function isFile(value: any): value is File {
  return (
    value &&
    'buffer' in value &&
    'name' in value &&
    'type' in value &&
    'size' in value
  );
}

// Handler function
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse the incoming event body
    const body: PredictionRequest = JSON.parse(event.body || '{}');

    // Validate the request structure
    if (!body.raw_data || typeof body.prediction !== 'boolean' || typeof body.is_correct !== 'boolean') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid request structure',
          requiredFormat: {
            raw_data: 'Record<string, File | number>',
            prediction: 'boolean',
            is_correct: 'boolean'
          }
        })
      };
    }

    // Process the raw_data object
    const processedData: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(body.raw_data)) {
      if (isFile(value)) {
        processedData[key] = {
          fileName: value.name,
          fileType: value.type,
          fileSize: value.size,
        };
      } else if (typeof value === 'number') {
        processedData[key] = value;
      } else {
        throw new Error(`Invalid data type for key: ${key}`);
      }
    }

    // Example processing based on prediction and is_correct
    const result = {
      processedData,
      predictionAnalysis: {
        predictionMade: body.prediction,
        predictionAccuracy: body.is_correct,
        processedAt: new Date().toISOString(),
        // Add any additional processing logic here
      }
    };

    // Return successful response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Error processing request:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    };
  }
};

// Example test event for local testing
const testEvent: APIGatewayProxyEvent = {
  body: JSON.stringify({
    raw_data: {
      file1: {
        buffer: Buffer.from('test data'),
        name: 'test.txt',
        type: 'text/plain',
        size: 9
      },
      numericValue1: 42
    },
    prediction: true,
    is_correct: true
  }),
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '/predict',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: ''
};

// Example usage for local testing
async function localTest() {
  const result = await handler(testEvent);
  console.log('Test result:', JSON.stringify(result, null, 2));
}
