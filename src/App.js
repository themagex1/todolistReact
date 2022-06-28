
import './App.css';
import axios from "axios";
import React, { useEffect, useState } from 'react';

const apiPrefix = "http://localhost:4000"


function App() {
  const [todos, setTodos] = useState([])
  const [text, setText] = useState("")

  async function getAllTodos(param) {
    return await axios.get(`${apiPrefix}/api/all`)
      .then(response => {
        const textResponse = response.data
        if (param === 'todo') {
          setTodos(textResponse.filter(t => !t.done))
          return textResponse.filter(t => !t.done)
        }
        else if (param === 'done') {
          setTodos(textResponse.filter(t => t.done))
          return textResponse.filter(t => t.done)
        }
        else {
          setTodos(textResponse)
          return textResponse
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  async function deleteTodo(id) {
    return await axios.delete(`${apiPrefix}/api/all/` + id)
      .then(async () => {
        await refresh()
      })
      .catch(e => {
        console.log(e)
      })
  }

  async function addTodo() {
    await axios.post(`${apiPrefix}/api/all`, { text: text })
      .then(response => {
        refresh()
      })
  }

  async function changeTodo(id, state) {
    await axios.patch(`${apiPrefix}/api/all/` + id, { done: state })
      .then(() => {
        refresh()
      })
  }

  async function refresh() {
    setTodos(await getAllTodos());
  }

  useEffect(() => {
    refresh();
  }, [])

  return (
    <div className='content'>
      <div className="row w-[40rem] flex mx-auto mt-8">
        <button className="mx-auto w-[100%] border border-solid" onClick={async () => await getAllTodos()}>
          All
        </button>
        <button className="mx-auto w-[100%] border border-solid" onClick={async () => await getAllTodos('todo')}>
          ToDo
        </button>
        <button className="mx-auto w-[100%] border border-solid" onClick={async () => await getAllTodos('done')}>
          Done
        </button>
      </div>
      {
        todos.map((x, index) => <div className="w-[40rem] flex mx-auto" >
          <div className="mx-auto mt-6 grid grid-cols-3" key={index}>
            <input type="checkbox" checked={x.done} onChange={async () => await changeTodo(x._id, !x.done)} />
            <span className="">
              {x.text}
            </span>
            <button className="ml-6 my-auto" onClick={async () => await deleteTodo(x._id)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        )
      }


      <div className="w-[40rem] flex mx-auto">
        <div className="mx-auto  mt-16">
          <div className="text-xl text-center mb-4">
            Aby dodać wpisz i kliknij przycisk
          </div>
          <input type="text" className="border-b border-b-black" onChange={(e) => setText(e.target.value)} />
          <button className="ml-6 border w-[10rem] h-8" onClick={async () => await addTodo()}>
            Dodaj
          </button>
        </div>
      </div>

    </div>

  );
}

export default App;
