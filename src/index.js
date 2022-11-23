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
    response.status(404).json({error: "Username not found"})
  }
  
  request.user = user;
  
  return next();
}

function checkIdTodo(todos, id){
  const todoToAlter = todos.find(todos => todos.id === id);

  if(!todoToAlter){
    return response.status(404).json({error: "ID not Found"})
  }

  return todoToAlter;
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

  const user = users.find(user => user.username === username);
  
  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;

  return response.status(201).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title,deadline} = request.body;

  const todosObject = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  
  user.todos.push(todosObject);

  return response.status(201).json(todosObject)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;

  const {todos} = user;
  //const todoToAlter = checkIdTodo(todos, id);

  const todoToAlter = todos.find(todos => todos.id === id);
  if(!todoToAlter){
    return response.status(404).json({error: "ID not Found"})
  }

  todoToAlter.title = title;
  todoToAlter.deadline = new Date(deadline);

  return response.status(200).json(todoToAlter)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {todos} = user;
  const {id} = request.params;

  //const todoToAlter = checkIdTodo(todos,id);
  
  const todoToAlter = todos.find(todos => todos.id === id);
  if(!todoToAlter){
    return response.status(404).json({error: "ID not Found"})
  }
  
  todoToAlter.done = true;

  return response.status(201).json(todoToAlter);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {todos} = user;

  const {id} = request.params;

  //const todoToAlter = checkIdTodo(todos,id);
  
  const todoIndex = todos.findIndex(todos => todos.id === id);
  if(todoIndex === -1){
    return response.status(404).json({error: "ID not Found"})
  }

  user.todos.splice(todoIndex,1);

  return response.status(204).json();
});

module.exports = app;