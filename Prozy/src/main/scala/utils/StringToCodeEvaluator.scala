package utils
import cats.effect.IO
import org.graalvm.polyglot.Context
import org.graalvm.polyglot.Value
import org.http4s.{HttpRoutes, Request}
import webserver.IMiddleware

import scala.runtime.AbstractFunction1
import scala.quoted.*
import scala.compiletime.*


def buildMiddlewareFromConfigMiddleware(functionStr: String): IMiddleware = {
  class MiddlewareFromString extends IMiddleware {
    override def apply(routes: HttpRoutes[IO]): HttpRoutes[IO] = {
      HttpRoutes { request =>
         
        routes(request)
      }
    } 
  }
  
  return new MiddlewareFromString()
}