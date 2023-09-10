import { useState } from 'react';
import '../css/Item.css';

export default function Item({item, updateHandler, removeHandler, prioritizeHandler, isNew}) {
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);
  const [content, setContent] = useState(item.content);
  const [isPrio, setIsPrio] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isAdded, setIsAdded] = useState(isNew);
  const id = item.id;
  let _complete = isCompleted;

  const currentItem = () => {
    return {
      id: id, 
      content: content,
      isCompleted: _complete 
    }
  };
  const getActionClass = () => {
    let classes = ["item"];
    if (isRemoved) {
      classes.push("remove");
    } 
    if (isPrio) {
      classes.push("prio");
    }
    if (isCompleted) {
      classes.push("checked");
    }
    if (isAdded) {
      classes.push("add");
    }
    return classes.join(" ");
  };

const performAction = (animationName) => {
  if(animationName === "prio_up") {
    setIsPrio(false);
  }
  if (animationName === "remove_item") {
    setIsRemoved(false);
    removeHandler();
  }
  if (animationName === "add_item") {
    setIsAdded(false);
  }
};

const updateTodo = () => {
  let item = currentItem();
  if (item.content.trim() === "") {
    setIsRemoved(true);
  } else {
    updateHandler(item);
  }
};

// Touch
const [touchStartX, setTouchStartX] = useState(null);
const [touchEndX, setTouchEndX] = useState(null);

const handleTouchStart = (e) => {
  setTouchStartX(e.touches[0].clientX);
};

const handleTouchMove = (e) => {
  setTouchEndX(e.touches[0].clientX);
};

const handleTouchEnd = () => {
  if (touchStartX && touchEndX) {
    const deltaX = touchEndX - touchStartX;
    if (deltaX > 50) {
      // Right-swipe
      if (isCompleted) {
        setIsRemoved(true);
      } else {
        updateCompleteStatus(true);      }
    } else if (deltaX < -50) {
      // Left-swipe
      updateCompleteStatus(true);
    }
  }
  // Återställ touch-variabler
  setTouchStartX(null);
  setTouchEndX(null);
};

const updateCompleteStatus = (status) => {
  _complete = status;
  setIsCompleted(_complete);
  updateTodo();
}

  return (
    <li className={getActionClass()} 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onAnimationEnd={(event) => performAction(event.animationName)}>
      <form onSubmit={(event) => {
          event.preventDefault();
          updateTodo();
        }}>

        <label className='checkbox' htmlFor={"check_" + id}>
          <span className='visuallyhidden'>{isCompleted ? "Uncheck" : "Check"}</span>
          <input type="checkbox" checked={isCompleted} id={"check_" + id} onChange={() => {
                          updateCompleteStatus(!isCompleted);
                        }} />
          <svg className='checkmark' xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 7 7">
            <path fillRule="evenodd" d="M6.3.6c.2.1.3.4.1.7l-3 5a.5.5 0 0 1-.8 0l-2-2a.5.5 0 0 1 .8-.7l1.5 1.6L5.6.7c.1-.2.4-.3.7-.1Z" clipRule="evenodd"/>
          </svg>
        </label>

        <div className='options'>
          <label className='visuallyhidden' htmlFor={"input_" + id}>{isCompleted ? "Done:" : "Todo:"}</label>
          <input type="text" placeholder="Todo" value={content} id={"input_" + id} 
            onChange={(event) => {
              setContent(event.target.value);
            }}
            onBlur={() => {
              updateTodo();
            }} />

          <div className='buttons'>
          <button className='remove' type='button' onClick={() => setIsRemoved(true)}>
            <span className='visuallyhidden'>Remove</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 7 7">
                <path fillRule="evenodd" d="M.4 6.4a.5.5 0 0 1 0-.8L5.6.4c.2-.2.6-.2.8 0V1L1 6.4H.4Z" clipRule="evenodd"/>
                <path fillRule="evenodd" d="M.4.4C.5.2.9.2 1 .4l5.3 5.2c.1.2.1.6 0 .8-.2.1-.6.1-.8 0L.4 1a.5.5 0 0 1 0-.7Z" clipRule="evenodd"/>
              </svg>
            </button>
            <button className='prio' type='button' onClick={(event) => {
              prioritizeHandler();
              event.target.focus();
              setIsPrio(true);
              }}><span className='visuallyhidden'>Prioritize</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 7 8">
                <path fillRule="evenodd" d="M3.5.5c.3 0 .5.2.5.5v6a.5.5 0 0 1-1 0V1c0-.3.2-.5.5-.5Z" clipRule="evenodd"/>
                <path fillRule="evenodd" d="M3.5.5c.1 0 .3 0 .4.2l2.5 3a.5.5 0 1 1-.8.6L3.5 1.8 1.4 4.3a.5.5 0 1 1-.8-.6l2.5-3 .4-.2Z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </form>      
    </li>
  );
}