import cats.data.OptionT
import cats.effect.{IO, IOApp}
import types.CORSConfig
import org.http4s.ember.client.EmberClientBuilder
import org.http4s.{HttpRoutes, Method, Request, Response, Uri}
import webserver.{IMiddleware, ReverseProxy}
import org.http4s.{Headers, Status}
import org.http4s.implicits._
import cats.data.OptionT
import cats.effect.IO
import org.http4s._
import org.http4s.headers._


enum Service(val name: String, val url: String):
  case AUTH extends Service("auth", "http://localhost:8080")
  case PREDICTION extends Service("prediction","http://localhost:5000")
  case MAIN extends Service("main", "http://localhost3003")
  case UPLOAD extends Service("upload", "http://localhost:4001")
  case UNKNOWN extends Service("unknown", "http://unknown-service")
  case ML extends Service("ml", "http://localhost:5000")
  case DIAG extends Service("diag", "http://localhost:3001")

object Service:
  def fromString(name: String): Service =
    values.find(_.name == name).getOrElse(UNKNOWN)

def resolveService(req: Request[IO]): String =
  println("rererere")
  req.uri.path.segments.headOption
    .map(_.decoded())
    .map(Service.fromString)
    .map(_.url)
    .getOrElse(Service.UNKNOWN.url)

class CorsMiddleware extends IMiddleware {
  def apply(routes: HttpRoutes[IO]): HttpRoutes[IO] = {
    HttpRoutes { request =>
      routes(request).map { response =>
        response.putHeaders(
          "Access-Control-Allow-Origin" -> "*",
          "Access-Control-Allow-Methods" -> "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers" -> "Content-Type, Authorization",
          "Access-Control-Allow-Credentials" -> "true"
        )
      }.orElse {
        // Handle OPTIONS requests directly
        if (request.method == Method.OPTIONS) {
          OptionT.some(Response[IO](status = org.http4s.Status.Ok).putHeaders(
            "Access-Control-Allow-Origin" -> "*",
            "Access-Control-Allow-Methods" -> "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers" -> "Content-Type, Authorization",
            "Access-Control-Allow-Credentials" -> "true"
          ))
        } else {
          OptionT.none
        }
      }
    }
  }
}

object Main extends IOApp.Simple:
  println("running server")
  def run: IO[Unit] =
    EmberClientBuilder.default[IO].build.use { client =>
      ReverseProxy()
        .withResolver { req =>
          val baseUrl = resolveService(req)
          println("resolved")
          println(baseUrl)
          Uri.unsafeFromString(baseUrl).withPath(req.uri.path)
        }
        .withSSL(
          keystorePath = "/root/flask-reverse-2/keystore.p12",
          keystorePassword = "changeit",
          keyManagerPassword = "changeit"
        )
        .addMiddleware(new CorsMiddleware()) // Replace addCors with the new middleware
        .withLogging(req => IO.println(s"Proxying request: ${req.method} ${req.uri}"))
        .build()
        .listen(port = 2053, host = "0.0.0.0", client)
        .as(())
    }
