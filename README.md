# Diagnosidy

## Diagnosify is a platform designed to gain medical data for trainig and testing ml to better healthcare while also streamlinig the process of jumping from one doctor to other.


## How it works

There are multiple disease categories in which you submit certain readings and they get posted into a feed where other doctors can later review. Where does ML come to play? - well 
each time you submit thr form with the readings a prediction from the model is made and it shows the prediction from which the doctor could directly submit feedback whether its true or false or 
send it to the ffed where after a trigger has been accomplished ( for example certain numbers of votes or 1 vote) the sender will be notified and the labeled data will be sent.

# Benefits of the system 

 - Easy data gathering -> Since ml could help a lot in the medical field ( as it is used now ) but it suffers from lack of labeled and organized data, Diagnosify makes the process easy but essentially running it in the background
 - Saving time -> a lot of the times we are redirected from doctor to doctor the only thing they do is look at a piece of paper without making a checkup and like that wasting us multiple days but with Diagnosify the sharing of docs happens seamlessly 

# Tech Stack

 - DBs: Redis for cache, MongoDB for auth and postgre for general data storage
 - ML: Tensorflow, keras
 - Backend: FastApi ( for exposing the ml as a server ), NodeJS and ts for general backend
 - Frontend: NextJS 
 - Deplyment: AWS, K8S, Docker 
 - RabbitMQ for message queue ( if something happens to the main bckend we would want to lose potential diagnoses )

# Architecture - to be made


## Disclaimer 
Patients will be asked for confirmation of gathering data
