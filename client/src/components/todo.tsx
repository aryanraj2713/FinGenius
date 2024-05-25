// src/App.tsx

import React, { useState, useEffect } from 'react';

const Todo: React.FC = () => {
    const [todos, setTodos] = useState<TodoItem[]>(() => {
        // Load todos from localStorage on initial render
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [newTodo, setNewTodo] = useState({ category: '', limit: 0, used: 0 });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentTodo, setCurrentTodo] = useState<TodoItem | null>(null);

    useEffect(() => {
        // Save todos to localStorage whenever todos state changes
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTodo({
            ...newTodo,
            [name]: name === 'limit' || name === 'used' ? parseInt(value) : value,
        });
    };

    const addTodo = () => {
        const percentageUsed = (newTodo.used / newTodo.limit) * 100;
        const todo: TodoItem = {
            id: Date.now(),
            ...newTodo,
            percentageUsed,
        };
        setTodos([...todos, todo]);
        setNewTodo({ category: '', limit: 0, used: 0 });
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const editTodo = (todo: TodoItem) => {
        setIsEditing(true);
        setCurrentTodo(todo);
        setNewTodo({ category: todo.category, limit: todo.limit, used: todo.used });
    };

    const updateTodo = () => {
        if (currentTodo) {
            const updatedTodos = todos.map(todo =>
                todo.id === currentTodo.id
                    ? { ...currentTodo, ...newTodo, percentageUsed: (newTodo.used / newTodo.limit) * 100 }
                    : todo
            );
            setTodos(updatedTodos);
            setIsEditing(false);
            setCurrentTodo(null);
            setNewTodo({ category: '', limit: 0, used: 0 });
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="space-y-4">
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={newTodo.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        name="limit"
                        placeholder="Limit"
                        value={newTodo.limit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        name="used"
                        placeholder="Used"
                        value={newTodo.used}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {isEditing ? (
                        <button
                            onClick={updateTodo}
                            className="w-full bg-black text-white py-2 rounded mt-2"
                        >
                            Update
                        </button>
                    ) : (
                        <button
                            onClick={addTodo}
                            className="w-full bg-black text-white py-2 rounded mt-2"
                        >
                            Add
                        </button>
                    )}
                </div>
                <div className="mt-6 space-y-4">
                    {todos.map(todo => (
                        <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} onEdit={editTodo} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Todo;

interface Props {
    todo: TodoItem;
    onDelete: (id: number) => void;
    onEdit: (todo: TodoItem) => void;
}

const TodoItem: React.FC<Props> = ({ todo, onDelete, onEdit }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold">{todo.category}</h3>
            <p>Limit: {todo.limit}</p>
            <p>Used: {todo.used}</p>
            <p>Percentage Used: {todo.percentageUsed.toFixed(2)}%</p>
            <div className="flex justify-end space-x-2 mt-2">
                <button
                    onClick={() => onEdit(todo)}
                    className="bg-black text-white py-1 px-3 rounded"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(todo.id)}
                    className="bg-black text-white py-1 px-3 rounded"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export interface TodoItem {
    id: number;
    category: string;
    limit: number;
    used: number;
    percentageUsed: number;
}
