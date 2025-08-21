import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [todos, setTodos] = useState([])
    const [input, setInput] = useState('')

    const fetchTodos = () => {
        fetch('http://localhost:15000/tasks')
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch((err) => console.error(err))
    }

    useEffect(() => {
        fetchTodos()
    }, [])

    const addTodo = () => {
        if (input.trim() === '') return

        const newTodo = { text: input, completed: false }

        fetch('http://localhost:15000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo),
        })
            .then((res) => res.json())
            .then(() => fetchTodos())
            .catch((err) => console.error(err))

        setInput('')
    }

    const toggleComplete = (todo) => {
        fetch(`http://localhost:15000/tasks/${todo._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !todo.completed }),
        })
            .then((res) => res.json())
            .then(() => fetchTodos())
            .catch((err) => console.error(err))
    }

    const deleteTodo = (id) => {
        fetch(`http://localhost:15000/tasks/${id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Delete failed')
                setTodos((prevTodos) => prevTodos.filter((t) => t._id !== id))
            })
            .catch((err) => console.error(err))
    }

    return (
        <div className="App">
            <h1>To Do List</h1>
            <input
                placeholder="Put text here"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={addTodo}>Add</button>

            <ul>
                {todos.map((todo) => (
                    <li
                        key={todo._id}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleComplete(todo)}
                        />
                        <span
                            style={{
                                marginLeft: '8px',
                            }}
                        >
                            {todo.text || 'No text'}
                        </span>
                        <button
                            style={{ marginLeft: 'auto' }}
                            onClick={() => deleteTodo(todo._id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App
