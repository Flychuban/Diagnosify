from fastapi import FastAPI, Request
from models_export_rerouter import models
print(models['diabetes']([[3,20,120,5,50,80,2,20]]))
app = FastAPI()
# def routes_data_builder(models): # since i dont wanna change the existing code i will just make an adapter, might decrease performance but it will be neglegible
#     def build_route(key, post_handler):
#         return {
#             "route":f"/{key}",
#             "post_handler":post_handler
#                 }
#     routes = [] 
#     for key in models.keys():
#         print(key)
#         routes.push(build_route(key, models[key]))

# routes_data =  routes_data_builder(models)


routes_data = [
    {
        "route": "/diabetes",
        "post_handler": lambda req: { "body":str(models["diabetes"](  [ [req['pregnancies'],req['glucose'], req['blood_pressure'], req['skin_thickness'], req['insulin'], req['bmi'], req['diabetes_pedigree_function'], req['age']    ]]     ))}
    },
    {
        "route": "/bye", 
        "post_handler": lambda req: {"message": "Goodbye, FastAPI!"}
    }
]

for route_data in routes_data:
    route = route_data["route"]
    handler = route_data["post_handler"]

    async def post_handler(request: Request, handler=handler):
        print(await request.json())
        request_object = await request.json()
        return handler(request_object['data'])

    async def data_pipeline_handler(request: Request, handler=):
        req = await request.json()
        print(req)
        return handler(req['data'])

    app.post(f"/ml{route}")(post_handler)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
