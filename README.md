# Frontend Take Home Challenge

Displays a list of articles from different APIs based on given filtering parameters

## Execution

The project is executed using docker and here is how it is run and accessed:
- ```docker compose up --build```

After docker has finished building and is running, access the news articles at port 3000 as defined in the dockerfile and the docker-compose
```http://localhost:3000/```

### Other

The UI is basically a list since the api endpoints dont return any thumbnail urls that may make the ui a bit pretty