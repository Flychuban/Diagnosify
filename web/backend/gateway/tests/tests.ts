import {getSubroute} from "../src/utils"

enum executionResult{
    FAILED,
    SUCCEEDED
}

type testExecutionResult = {
    status: executionResult,
    err ?: string
} 

function test1(): testExecutionResult{

    try {
        const subRoute = getSubroute("/auth/auth/issueNewTokenForUser")
    
        if (subRoute === "auth/issueNewTokenForUser") {
            return { status: executionResult.SUCCEEDED };
        }

        return { status: executionResult.FAILED, err: "Test 1 failed. Expected {/auth/issueNewTokenForUser} but got " + "{" +  subRoute  + "}"};
    } catch (e) { 
        return { status: executionResult.FAILED, err: "Test 1 failed. Error: " + e.message };
    }
}

function testSequenceForGetSubroute() {
    const testRes = test1();
    if (testRes.status === executionResult.FAILED)
    {
        console.log("test1 failed" + testRes.err);
        return; 
    }
    console.log("all tests passed!")
}


testSequenceForGetSubroute()