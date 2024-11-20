export enum executionResult{
    FAILED,
    SUCCEEDED
}

export type testExecutionResult = {
    status: executionResult,
    err ?: string
}

export interface Test < DependenciesType extends object > {
    execute: () => Promise<testExecutionResult> 
    dependencies: DependenciesType
}


export class Tests{
    private tests: Test<object>[]
    constructor() {
        this.tests = []
    }
    
    addTest<T extends object>(test: Test<T>) {
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