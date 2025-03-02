# SimpleReverseProxy

# Why
- I needed a https reverse proxy with more complex filtering functionality and nginx and traefik weren't good enough
- to learn a new language I wanted to learn for a long time
- for funnies
- I needed to write tests for my redirecting logic and writing them in a real lang would have made it easier (this is achieved easily since a handler is just a function soo it can be passed into unit tests)

# How to use

## Not s Standard Service
i dont like working with services i like working with code since it has lsp autocomplete and a compiler while a config has none of that so the way you
to use the service is to pull the code from the repo and edit the `main.scala` file where you will add your middlewares, cors config etc ...

# Features 

## Middlewares 
middlewares are added using the withMiddleware method


## Handlers
for the handler you use the with handler command (note only one handler can be defined and if you add another you will overwrite the original -> todo make it so that if you call withResolver twice in the builder you panic)


## easy to set up

## easy to set up ssl certs
- you have to use the `withSsl()` method 

# Extnding the base web server

## Getting started

### Downloading
- add this to your `build.sbt` 
  
  ```scala
  libraryDependencies += "to do" % "to do " % "1.0.0"
  ```
### Extending the web server
Example
```
import com.to_do.ReverseProxy

class MyCustomReverseProxyImplementation extends ReverseProxy{
}
```

# Examples

## Config
```json
{

}
```
