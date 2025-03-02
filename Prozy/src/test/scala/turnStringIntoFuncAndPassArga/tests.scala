//package turnStringIntoFuncAndPassArga
//
//import play.api.libs.json.Json
//import org.scalatest.funsuite.AnyFunSuite
//import utils.executeHandler
//
//class HandlerTest extends AnyFunSuite {
//
//  test("handler should return correct value from request") {
//    val code = """
//      (req) => {
//        console.log(JSON.stringify(req))
//        return req
//      }
//    """
//
//    var request = Map("val" -> "hi")
//
//    // Call executeHandler with code and request, and check if the result matches "hi"
//    assert(executeHandler(handlerCode = code, request = request.toString()) == "hi")
//  }
//
//}
