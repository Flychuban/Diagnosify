import { executionResult, testExecutionResult, Test, Tests } from './tester'; 
import { GatewayConfig } from "../src/types";
import {  getServiceUrl } from "../src/utils";


function createTest3(): Test<GatewayConfig> {
    const config: GatewayConfig = {
        auth: { redirect_url: "http://localhost:3000" },
        diagnosis: { redirect_url: "http://localhost:5001" }
    };

    return {
        dependencies: config,
        execute: async () => {
            try {
                const requestedUrl = "/auth/auth/getToken";
                const serviceUrl = getServiceUrl(requestedUrl, config);

                if (serviceUrl === "http://localhost:3000/auth/getToken") {
                    return { status: executionResult.SUCCEEDED };
                }

                return {
                    status: executionResult.FAILED,
                    err: `Expected "http://localhost:3000/auth/getToken" but got "${serviceUrl}"`
                };
            } catch (e) {
                return {
                    status: executionResult.FAILED,
                    err: `Error: ${e.message}`
                };
            }
        }
    };
}

// Add and Run Tests
async function main() {
    const tests = new Tests();

    // Add the tests
    tests.addTest(createTest3());
    // Run the tests
    await tests.runTests();
}

main().catch((err) => console.error(`Unexpected error: ${err}`));
