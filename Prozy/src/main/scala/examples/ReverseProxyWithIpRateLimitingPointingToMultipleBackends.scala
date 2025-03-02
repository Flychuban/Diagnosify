package examples

import cats.data.OptionT
import org.http4s.{Headers, Request, Response, Status}
import org.http4s.dsl.io.*
import org.http4s.implicits.*
import cats.effect.*
import com.comcast.ip4s.IpAddress
import webserver.{IMiddleware, ReverseProxy}
import cats.implicits.*
import org.http4s.*
import org.http4s.CharsetRange.*

import scala.collection.concurrent.TrieMap

object Visitors {
  private val visitors = new TrieMap[String, (Int, Long)]()

  def add(ip: String): Unit = {
    val now = System.currentTimeMillis()
    visitors.update(ip, visitors.get(ip) match {
      case Some((count, timestamp)) if now - timestamp < 60000 =>
        (count + 1, timestamp)  // Increment count if within 1 minute
      case _ =>
        (1, now)  // Reset count and timestamp if more than 1 minute has passed
    })
  }

  def getRequestCount(ip: String): Int = {
    visitors.get(ip).map(_._1).getOrElse(0)
  }

  def clearOldEntries(): Unit = {
    val now = System.currentTimeMillis()
    visitors.retain((_, value) => now - value._2 < 60000)
  }
}

class IpRateLimitingMiddleware(maxRequestsPerMinute: Int) extends IMiddleware {
  override def apply(routes: HttpRoutes[IO]): HttpRoutes[IO] = {
    HttpRoutes { request =>
      val ip = request.remoteAddr.map {
        case address: IpAddress => address.toString()
      }.getOrElse("Unknown IP")

      Visitors.add(ip)

      if (Visitors.getRequestCount(ip) > maxRequestsPerMinute) {
        OptionT.pure[IO](
          Response[IO](Status.TooManyRequests)
            .withEntity("Rate limit exceeded")
        )
      } else {
        routes(request)
      }
    }
  }
}

class ExampleMiddlewareWhichPrintsEveryRequest extends IMiddleware{
  override def apply(routes: HttpRoutes[IO]): HttpRoutes[IO] = {
    HttpRoutes { request =>
      println(request)
      routes(request)
    }
  }
}
@main def main(): Unit = {
  val proxy = ReverseProxy()
    .withLogging(request => println("Logging: " + request.uri))

  proxy.withResolver((req: Request[IO]) => {
    val services = Map(
      "auth" -> "http://localhost:300",
      "users" -> "http://localhost:301"
    )

    val url = services.get(req.uri.path.toString()) match {
      case None => "localhost:3000"
      case Some(service) => service
    }

    Uri.unsafeFromString(url).withPath(req.uri.path)
  })

  // Add IP rate limiting middleware with a max of 100 requests per minute
  proxy.addMiddleware(new IpRateLimitingMiddleware(maxRequestsPerMinute = 100)).addMiddleware(new ExampleMiddlewareWhichPrintsEveryRequest)
}