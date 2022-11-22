const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;
  const user = users.find(users => users.username === username);
  
  if (!user){
    response.status(400).json({error: "Username not found"})
  }
  
  request.user = user;
  
  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;
  
  const userAlreadyExist = users.some((users)=> users.username === username);

  if(userAlreadyExist){
    response.status(400).json({error: "Username already exists"})
  }
  
  users.push({
      name,
      username,
      id: uuidv4(),
      todos: []
    });

  const user = users.find(users => users.username === username);
  
  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;

  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title} = request.body;
  const {deadline} = request.query;

  const todosObject = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline + " 00:00") ,
    created_at: new Date()
  }
  
  user.todos.push(todosObject);

  return response.status(201).json(todosObject)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {todos} = user;
  
  const {id} = request.params;
  const {title, deadline} = request.body;

  const todoToAlter = todos.find(todos => todos.id === id);

  if(todoToAlter.id !== id){
    return response.status(400).json({error: "ID not Found"})
  }

  todoToAlter.title = title;
  todoToAlter.deadline = new Date(deadline + " 00:00");

  return response.status(200).json(user)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;