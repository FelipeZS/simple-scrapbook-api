const express = require("express");
const {uuid} = require("uuidv4")

const app = express();

// REQUEST BODY
app.use(express.json());

const recados = [];

app.get('/recados', (request, response) => {
    //QUERY PARAMS
    const {title} = request.query;

    // estrutura condicional ternária
    const results = title ? recados.filter(project => project.title.includes(title)) : recados;

    return response.json(results);
});

// (POST)
app.post('/recados', (request, response) => {
    // REQUEST BODY
    const {title, owner} = request.body;

    const recado = {id: uuid(), title, owner};

    recados.push(recado);

    return response.json(recado);
});

// (PUT)
// ex: http://localhost:3333/projects/2
app.put('/recados/:id', (request, response) => {
    // ROUTE PARAMS
    const {id} = request.params;
    const {title, owner} = request.body;

    const recadoIndex = recados.findIndex((project) => project.id === id);

    if (recadoIndex < 0) {
        return response.status(400).json({error: "Project not found."});
    }

    const recado = {
        id, 
        title, 
        owner
    };

    recados[recadoIndex] = recado;

    return response.json(recado);
});

// // (DELETE)
app.delete('/recados/:id', (request, response) => {

    const {id} = request.params;

    const recadoIndex = recados.findIndex((project) => project.id === id);

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