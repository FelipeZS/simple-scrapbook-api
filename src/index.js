const express = require("express");
const {uuid, isUuid} = require("uuidv4")

const app = express();

// REQUEST BODY
app.use(express.json());

const recados = [];

// middleware que faz log e calcula o tempo das requisições.
function logRequests(request, response, next) {
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next(); 

    console.timeEnd(logLabel);
}

// middleware que valida se o uuid do projeto é válido.
function validadeProjectId(request, response, next) {
    const {id} = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({error: "Param sent is not a valid UUID"});
    }

    next();
}

// middleware que não adiciona um scrap com titulo e/ou mensagem vazios.
function checkEmptyScraps(request, response, next) {
    const {title, message} = request.body;

    if (title == "" || message == "") {
        return response.status(400).json({error: "Fill in all fields"});
    }

    next();
}

app.use(logRequests);

app.get('/recados', (request, response) => {
    //QUERY PARAMS
    const {title} = request.query;

    // estrutura condicional ternária
    const results = title ? recados.filter(recado => recado.title.includes(title)) : recados;

    return response.json(results);
});

// (POST)
app.post('/recados', checkEmptyScraps, (request, response) => {
    // REQUEST BODY
    const {title, message} = request.body;

    const recado = {id: uuid(), title, message};

    recados.push(recado);

    return response.json(recado);
});

// (PUT)
// ex: http://localhost:3333/projects/2
app.put('/recados/:id', validadeProjectId, (request, response) => {
    // ROUTE PARAMS
    const {id} = request.params;
    const {title, message} = request.body;

    const recadoIndex = recados.findIndex((recado) => recado.id === id);

    if (recadoIndex < 0) {
        return response.status(400).json({error: "Project not found."});
    }

    const recado = {
        id, 
        title, 
        message
    };

    recados[recadoIndex] = recado;

    return response.json(recado);
});

// // (DELETE)
app.delete('/recados/:id', validadeProjectId, (request, response) => {

    const {id} = request.params;

    const recadoIndex = recados.findIndex((recado) => recado.id === id);

    if (recadoIndex < 0) {
        return response.status(400).json({error: "Project not found."});
    }

    recados.splice(recadoIndex, 1);

    return response.status(204).send();
         
});

const port = 3333;
app.listen(3333, () => {
    console.log(`Server up and running on PORT ${port}`);
});