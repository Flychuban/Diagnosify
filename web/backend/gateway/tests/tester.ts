import { GatewayConfig } from "../src/types"
import { getServiceUrl } from "../src/utils"

export enum executionResult{
    FAILED,
    SUCCEEDED
}

export type testExecutionResult = {
    status: executionResult,
    err?: string
}

export interface Test < DependenciesType extends object, typeOfExpected> {
    execute: () => Promise<testExecutionResult> 
    // dependencies: DependenciesType 
    expected: typeOfExpected
}


function createTest<typeOfExpected, Dependencies, argsType>(
    info: {
        expected: typeOfExpected,
        funcToRun: () => Promise<testExecutionResult>,
        // dependencies: Dependencies
    }) {
    return {
        // dependencies: info.dependencies,
        execute: async () => {
            try {
                const testRes = await info.execute(info);
                if (testRes.status === executionResult.FAILED) {
                    return { status: executionResult.FAILED, err: "Test failed" };
                } else {
                    return { status: executionResult.SUCCEEDED };
                }
            } catch (e) {
                return { status: executionResult.FAILED, err: `Test failed due to an error: ${e}` };
            }
        },
        expected: info.expected  // Assuming expected is the expected result of the test function.
    } 
}



createTest<string,object,{requestUrl: string,config: GatewayConfig}>({
    expected: "http://http://localhost:3000/auth/getToken", funcToRun: () => {
        if(getServiceUrl())
    } ,

)


export class Tests{
    private tests: Test<object,any>[]
    constructor() {
        this.tests = []
    }
    
    addTest<T extends object,V extends any>(test: Test<T,V>) {
        this.tests.push(test)
    }

    async runTests() {
        for (const test of this.tests) {
            try {
                const testRes = await test.execute();
                if (testRes.status === executionResult.FAILED) {
                    console.error(`Test failed: ${testRes.err}`);
                } else {
                    console.log(`Test passed`);
                }
            } catch (e) {
                console.error(`Test failed due to an error: ${e}`);
            }
        }
    }
}