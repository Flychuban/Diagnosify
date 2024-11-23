import { LambdaClient, InvokeCommand, InvokeCommandInput } from "@aws-sdk/client-lambda";

async function invokeLambda(
  functionName: string,
  payload: Record<string, any>,
  region: string = "us-east-1"
): Promise<any> {
  // Initialize Lambda client
  const client = new LambdaClient({ region });

  // Prepare the parameters
  const params: InvokeCommandInput = {
    FunctionName: functionName,
    InvocationType: "RequestResponse", // Use 'Event' for async invocation
    Payload: JSON.stringify(payload),
  };

  try {
    // Create and execute the command
    const command = new InvokeCommand(params);
    const response = await client.send(command);

    // Handle the response
    if (response.StatusCode !== 200) {
      throw new Error(`Lambda invocation failed with status ${response.StatusCode}`);
    }

    // Parse the response payload
    if (response.Payload) {
        const responsePayload = new TextDecoder().decode(response.Payload);
        return JSON.parse(responsePayload);
    }

    return null;
  } catch (error) {
    console.error("Error invoking Lambda:", error);
    throw error;
  }
}

// Example usage
async function example() {
  try {
    const result = await invokeLambda(
      "my-function-name",
      {
        key1: "value1",
        key2: "value2"
      }
    );
    console.log("Lambda response:", result);
  } catch (error) {
    console.error("Failed to invoke Lambda:", error);
  }
}
