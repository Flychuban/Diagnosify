package webserver

import cats.effect.{IO, ExitCode, Resource}
import com.comcast.ip4s
import org.http4s.client.Client
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.Router
import org.http4s.{HttpRoutes, Request, Response, Uri}
import types.LoggingTypes.{CUSTOM, NONE}
import types.{CORSConfig, LoggingTypes}
import com.comcast.ip4s.{Host, Port}
import fs2.io.net.tls.TLSContext
import java.security.{KeyStore, SecureRandom}
import javax.net.ssl.{KeyManagerFactory, SSLContext, TrustManagerFactory}
import java.io.FileInputStream

trait IMiddleware {
  def apply(routes: HttpRoutes[IO]): HttpRoutes[IO]
}

class MiddlewareLoadedFromFile extends IMiddleware {
  def apply(routes: HttpRoutes[IO]): HttpRoutes[IO] = routes
}

case class Origin(value: String)

object Origin {
  def apply(origin: String): Option[Origin] = {
    if (origin.startsWith("http://") || origin.startsWith("https://")) Some(new Origin(origin))
    else None
  }
}

enum Method(val method: String) {
  case Get extends Method("GET")
  case Post extends Method("POST")
  case Put extends Method("PUT")
  case Delete extends Method("DELETE")
}

case class SSLConfig(
                      keystorePath: String,
                      keystorePassword: String,
                      keyManagerPassword: String,
                      keystoreType: String = "PKCS12"
                    )

class ReverseProxy private (
                             val resolver: Option[Request[IO] => Uri],
                             val middlewares: List[IMiddleware],
                             val corsConfig: Option[CORSConfig],
                             val logging: LoggingTypes,
                             val sslConfig: Option[SSLConfig]
                           ) {

  private def createSSLContext(sslConfig: SSLConfig): SSLContext = {
    val keystore = KeyStore.getInstance(sslConfig.keystoreType)
    val keystoreFile = new FileInputStream(sslConfig.keystorePath)
    try {
      keystore.load(keystoreFile, sslConfig.keystorePassword.toCharArray)
    } finally {
      keystoreFile.close()
    }

    val keyManagerFactory = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm)
    keyManagerFactory.init(keystore, sslConfig.keyManagerPassword.toCharArray)

    val trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm)
    trustManagerFactory.init(keystore)

    val sslContext = SSLContext.getInstance("TLS")
    sslContext.init(
      keyManagerFactory.getKeyManagers,
      trustManagerFactory.getTrustManagers,
      new SecureRandom()
    )

    sslContext
  }

  private def createTLSContext(sslConfig: SSLConfig) = {
    TLSContext.Builder.forAsync[IO].fromSSLContext(createSSLContext(sslConfig))
  }

  def listen(
              port: Int = 8080,
              host: String = "127.0.0.1",
              client: Client[IO]
            ): IO[ExitCode] = {
    val proxyRoutes = HttpRoutes.of[IO] { case req =>
      IO(println(s"Handling request: ${req.method} ${req.uri}")) *>
        this.resolver
          .map(r => client.run(req.withUri(r(req))).use(IO.pure))
          .getOrElse(IO.pure(Response.notFound[IO]))
    }

    val routesWithMiddleware = middlewares.foldLeft(proxyRoutes) { (routes, middleware) =>
      middleware(routes)
    }

    val httpApp = Router("/" -> routesWithMiddleware).orNotFound

    val baseBuilder = EmberServerBuilder
      .default[IO]
      .withHost(Host.fromString(host).getOrElse(sys.error(s"Invalid host: $host")))
      .withPort(Port.fromInt(port).getOrElse(sys.error(s"Invalid port: $port")))
      .withHttpApp(httpApp)

    val serverBuilder = sslConfig match {
      case Some(config) =>
        baseBuilder.withTLS(createTLSContext(config))
      case None =>
        baseBuilder
    }

    serverBuilder
      .build
      .useForever
      .as(ExitCode.Success)
  }
}

object ReverseProxy {
  def apply(): Builder = new Builder()

  class Builder {
    private var resolver: Option[Request[IO] => Uri] = None
    private var middlewares: List[IMiddleware] = List()
    private var corsConfig: Option[CORSConfig] = None
    private var logging: LoggingTypes = NONE
    private var sslConfig: Option[SSLConfig] = None

    def withLogging(loggingHandler: Request[IO] => Unit): Builder = {
      class LoggingMiddleware extends IMiddleware {
        override def apply(routes: HttpRoutes[IO]): HttpRoutes[IO] = {
          HttpRoutes { request =>
            loggingHandler(request)
            routes(request)
          }
        }
      }
      middlewares = middlewares :+ new LoggingMiddleware()
      logging = CUSTOM
      this
    }

    def withResolver(resolverFunction: Request[IO] => Uri): Builder = {
      resolver = Some(resolverFunction)
      this
    }

    def addMiddleware(middleware: IMiddleware): Builder = {
      middlewares = middlewares :+ middleware
      this
    }

    def addCors(config: CORSConfig): Builder = {
      corsConfig = Some(config)
      this
    }

    def withSSL(
                 keystorePath: String,
                 keystorePassword: String,
                 keyManagerPassword: String,
                 keystoreType: String = "PKCS12"
               ): Builder = {
      sslConfig = Some(SSLConfig(
        keystorePath,
        keystorePassword,
        keyManagerPassword,
        keystoreType
      ))
      this
    }

    def build(): ReverseProxy = {
      new ReverseProxy(resolver, middlewares, corsConfig, logging, sslConfig)
    }
  }
}