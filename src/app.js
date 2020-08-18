const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do bakck-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

 /**
  * Tipos de parâmetros:
  * 
  * Query Params: Filtros e paginação
  * Route Params: Identificar recursos (Atualizar/Deletar)
  * Request Bodey: Conteúdo na hora de criar ou editar um reucurso (JSON)
  */

  /**
   * Middleware:
   * 
   * Interceptador de requisições que interrromper totalmente a requisição ou lterar dados da requisição.
   */

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title 
  ? repositories.filter(repositorie => repositorie.title.includes(title)) 
  : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs=[]} = request.body;

  const repository = {
     id: uuid(),
     title,
     url,
     techs,
     likes: 0,
    };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs=[] } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes:repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if(!repository){
    return response.status(400).send();
  }

  repository.likes += 1;

  return response.json(repository);

});

module.exports = app;
