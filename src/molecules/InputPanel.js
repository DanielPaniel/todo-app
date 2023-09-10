import { useState } from 'react';
import '../css/Item.css';

export default function InputPanel({inputHandler}) {
  const [newItem, setNewItem] = useState("");
  const id = "input_id";
  const handleSubmit = (event) => {
    event.preventDefault();
    inputHandler(newItem);
    setNewItem('');
  };
  return (
    <li className='item'>
      <form onSubmit={handleSubmit}>
        <label className="visuallyhidden" htmlFor={id}>Add a todo</label>
        <input type="text" value={newItem} placeholder="Add todo" id={id} onChange={(event) => setNewItem(event.target.value)} />
      </form>
    </li>
  );
}