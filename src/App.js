import Item from './molecules/Item';
import './css/App.css';
import { useEffect, useState } from 'react';
import InputPanel from './molecules/InputPanel';

function App() {

  let [todos, setTodos] = useState([]);
  const getNbrCompletedTodos = () => todos.filter((todo) => todo.isCompleted === true).length;
  let [showRevealAnimation, setShowRevealAnimation] = useState(false);
  const getTodosFromLocalStorage = () => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  };

  useEffect(() => {
    getTodosFromLocalStorage();
  }, []);

  const saveTodosToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
    getTodosFromLocalStorage();
  };


  const addTodoHandler = (todo) => {
    if (todo.trim() !== '') {
      setShowRevealAnimation(true);
      saveTodosToLocalStorage([...todos, {id: generateId(5), content: todo, isCompleted: false}]);
    }
  };

  const updateTodoHandler = (todo) => {
    let index = todos.findIndex((listItem) => {
      return listItem.id === todo.id;
    });
    todos[index] = todo;
    saveTodosToLocalStorage(todos);
  };

  const prioritizeTodoHandler = (index) => {
    if (index > 0) {
      [todos[index], todos[index - 1]] = [todos[index - 1], todos[index]];
    }
    saveTodosToLocalStorage(todos);
  };

  const removeTodoHandler = (itemId) => {
    todos = todos.filter((listItem) => listItem.id !== itemId); 
    saveTodosToLocalStorage(todos);
  };

  const generateId = (length) => {
    return [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
  };

  return (
    <div className='app'>
      <header className='topbar'>
        <h1>Todo <span>{getNbrCompletedTodos()}/{todos.length}</span></h1>
        <div className='buttons'>
          <button onClick={()=>{ saveTodosToLocalStorage([])}}>Reset</button>
          <button onClick={() => {saveTodosToLocalStorage(todos.filter((todo) => todo.isCompleted === false))}}>Clear completed</button>
        </div>
      </header>

      <ol className='list'>
        {todos.map((item, index) =>       
          (<Item 
            key={item.id}
            item={item}
            updateHandler={updateTodoHandler}
            prioritizeHandler={() => {prioritizeTodoHandler(index)}}
            removeHandler={() => {removeTodoHandler(item.id)}}
            isNew={index === todos.length-1 && showRevealAnimation}
          ></Item>
          ))
        }
      <InputPanel 
          inputHandler={addTodoHandler} />

      </ol>

    </div>
  );
}

export default App;
