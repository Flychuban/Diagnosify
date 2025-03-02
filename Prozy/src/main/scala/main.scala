import cats.effect.{IO, IOApp}
import types.CORSConfig
import org.http4s.ember.client.EmberClientBuilder
import org.http4s.{Request, Uri}
import webserver.ReverseProxy

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

class OptionsRequestMiddleware extends IMiddleware {
  override def apply(routes: HttpRoutes[IO]): HttpRoutes[IO] = {
    HttpRoutes { request =>
      if (request.method == Method.OPTIONS) {
        // Return a successful response for OPTIONS requests
        IO.pure(Response[IO](status = org.http4s.Status.Ok))
      } else {
        // If not an OPTIONS request, pass the request to the next handler
        routes(request)
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
          println("resloved")
          println(baseUrl)
          Uri.unsafeFromString(baseUrl).withPath(req.uri.path)
        }
        .addCors(CORSConfig())
        .withSSL(
        keystorePath = "/root/flask-reverse-2/keystore.p12",
        keystorePassword = "changeit",
        keyManagerPassword = "changeit"
          )
        .addMiddleware(new OptionsRequestMiddleware())
        .withLogging(req => IO.println(s"Proxying request: ${req.method} ${req.uri}"))
        .build()
        .listen(port = 2053, host = "0.0.0.0", client)
        .as(())
    }

