package types

import cats.effect.IO
import org.http4s.Request
import play.api.libs.json.*
import java.util.Optional
import org.http4s.server.middleware.CORSConfig as Http4sCORSConfig
case class RedirectionHandler(content: String)
case class Middleware(content: String)
case class SSLConfig(key: String)


trait CustomHandler {
  def apply(req: Request[IO]): Unit
}

case class Config(
                   middlewares: List[Middleware],
                   redirectionHandler: RedirectionHandler,
                   logging: LoggingTypes,
                   ssl: Optional[SSLConfig],
                   port: String,
                   host: String,
                   cors: CORSConfig,
                   timeout: Int = 100000,
                   defaultUrl: Option[String]
                 )



enum LoggingTypes(val handler: Option[CustomHandler]) { 
  case NONE extends LoggingTypes(None)
  case CUSTOM extends LoggingTypes(Some(new CustomHandler {
    override def apply(req: Request[IO]): Unit = {
      println(s"Handling request: $req") // Custom behavior
    }
  }))
  case DEFAULT extends LoggingTypes(Some(new CustomHandler {
    override def apply(req: Request[IO]): Unit = {
      println("Default handling") // Default behavior
    }
  }))
}

// CORS Configuration Class
case class CORSConfig(
                       allowedOrigins: List[String] = List("*"),
                       allowedMethods: List[String] = List("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"),
                       allowedHeaders: List[String] = List("Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"),
                       maxAge: Int = 1728000
                     ) {
  def toHttp4sCorsConfig(): Http4sCORSConfig = {
    Http4sCORSConfig.default
  }
}



object RedirectionHandler {
  implicit val format: Format[RedirectionHandler] = Json.format[RedirectionHandler]
}

object Middleware {
  implicit val format: Format[Middleware] = Json.format[Middleware]
}

// Format for LoggingTypes Enum
object LoggingTypes {
  implicit val format: Format[LoggingTypes] = new Format[LoggingTypes] {
    def reads(json: JsValue): JsResult[LoggingTypes] = json match {
      case JsString("NONE") => JsSuccess(LoggingTypes.NONE)
      case JsString("CUSTOM") => JsSuccess(LoggingTypes.CUSTOM)
      case JsString("ALL") => JsSuccess(LoggingTypes.DEFAULT)
      case _ => JsError("Unknown logging type")
    }
    def writes(t: LoggingTypes): JsValue = JsString(t.toString)
  }
}

// Format for CORSConfig
object CORSConfig {
  implicit val format: Format[CORSConfig] = Json.format[CORSConfig]
}

// Format for SSLConfig (with key properly initialized)
object SSLConfig {
  implicit val format: Format[SSLConfig] = Json.format[SSLConfig]
}

// Custom Format for Optional[SSLConfig]
object OptionalSSLConfig {
  implicit val format: Format[Optional[SSLConfig]] = new Format[Optional[SSLConfig]] {
    def reads(json: JsValue): JsResult[Optional[SSLConfig]] = json match {
      case JsNull => JsSuccess(Optional.empty())
      case _ =>
        SSLConfig.format.reads(json) match {
          case JsSuccess(value, _) => JsSuccess(Optional.of(value))
          case JsError(errors)     => JsError(errors)
        }
    }

    def writes(t: Optional[SSLConfig]): JsValue = {
      if (t.isPresent) {
        SSLConfig.format.writes(t.get)
      } else {
        JsNull
      }
    }
  }
}

