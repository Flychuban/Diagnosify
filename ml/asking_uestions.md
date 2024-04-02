how to programatically make the routes so that there is a def hadler which accepts a predict function e.g. something like that
def handle_login(predict_function):
data = req.json.data
const prediction = predict_function(\*data)
