from fastapi import FastAPI, Request
from models_export_rerouter import models
print(models['diabetes']([[3,20,120,5,50,80,2,20]]))
app = FastAPI()
routes_data = [
    {"route": "/diabetes", "post_handler": lambda req: {"message": "Hello, FastAPI!", "body":str(models["diabetes"](  [ [req['pregnancies'],req['glucose'], req['blood_pressure'], req['skin_thickness'], req['insulin'], req['bmi'], req['diabetes_pedigree_function'], req['age']    ]]     ))}},
    {"route": "/bye", "post_handler": lambda req: {"message": "Goodbye, FastAPI!"}},
]

for route_data in routes_data:
    route = route_data["route"]
    handler = route_data["post_handler"]

    async def post_handler(request: Request, handler=handler):
        print(await request.json())
        request_object = await request.json()
        return handler(request_object['data'])

    app.post(route)(post_handler)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
