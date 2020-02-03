const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

function checkProjectExist(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ message: "Não encontrado" });
  }

  return next();
}

function logCount(req, res, next) {
  console.count("Quantidade de requisições");

  return next();
}

server.use(logCount);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.put("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send("Removido com sucesso");
});

server.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(task);

  return res.json(project);
});

server.listen(3000);
