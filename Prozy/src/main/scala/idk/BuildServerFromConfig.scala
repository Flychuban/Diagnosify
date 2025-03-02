package idk

import types.Config
import webserver.ReverseProxy
import utils.buildMiddlewareFromConfigMiddleware
import org.http4s.{HttpRoutes, Request}
import cats.effect.IO

class Resolver {
  def apply(req: Request[IO]): String = {
    "hi"
  }
}

def buildResolver(functionStr: String): (req: Request[IO]) => String = {
   (req: Request[IO]) => "hi"
}