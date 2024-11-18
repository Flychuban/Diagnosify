# GATEWAY SERVICE DOCUMENTATION

## How It Works

### Config

### the service supports either a `.env` file ot loading it directly from a ts file 
see `gateway.ts` for more info  

### Example usage
First you need to create a config file which the service will use to reroute requests

here is an example one

`.env`
```bash
CONFIG="{"auth": {"redirect_url": "http://localhost:8080/"},"ml": {"redirect_url": "http://localhost:5000"},"diag": {"redirect_url": "http://localhost:3001"}}"
```

### How are requests rerouted 


every request to the gateway must follow this schema 
`htttp://<gateway_host>/<service_url>/<route_of_service>`


here is an example usage: 
this command 
```zsh
curl "http://localhost:7000/auth/auth/get" 
```


will be redirected to this url: `http://localhost:8080/auth/get` , see how the first auth is removed thats cuz we remove the service name so that its more flexible

another useful thing is that the `service_name` does not have to match the actual url, for example our auth backendd actually exposes a router called tokenCreator

example config
`.env`
```bash
CONFIG={"auth":{"redirect_url":"http://localhost:8000/tokenCreator"}}
```

example request
```zsh
curl "http://localhost:7000/auth/issueNewToken
```

this will make the following redirect `http://localhost:8080/tokenCreator/issueNewToken`






## Common mistakes
- adding `/` after a redirect url
   
   Example:
   
   wrong config:

   `CONFIG={"auth":{"redirect_url":"http://localhost:3000/"}}`

   a redirect will always have an additional slash 
   
   ```zsh
   curl "http://localhost:7000/auth/issueNewToken
   ```
   will result in `http://localhost:8000//issueNewToken`

   !hint look at the two slashes after the host, i mean if this is your desired behaviour, sure but just to note it as a commom mistake