from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/ml/pneumonia")
async def view_content(request: Request):
    content = await request.json()
    print(content)
    return {"content": "hi"}
import uvicorn
uvicorn.run(app, host="0.0.0.0", port=5000)




