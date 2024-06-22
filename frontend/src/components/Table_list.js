import React, { useState, useEffect } from 'react';
import Add_task from './Add_task';
import Todo_update from './Todo_update';
import UpdateTaskModal from './UpdateTaskModal';

function TableList() {
    const [todos, setTodos] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch('http://localhost:8000/todo_list/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const content = await response.json();
                setTodos(content);
            } catch (error) {
                console.error('Fetch error: ', error);
            }
        };

        fetchTodos();
    }, []);

    const updateStatus = async (id, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:8000/status_update/${id}?status_update=${!currentStatus}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedTodo = await response.json();
            setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
            window.location.reload();
        } catch (error) {
            console.error('Update error: ', error);
        }
    };

    const del = async id => {
        if (window.confirm('Are you sure to delete this task?')) {
            try {
                await fetch(`http://localhost:8000/todo_list/${id}`, {
                    method: 'DELETE'
                });
                setTodos(todos.filter(todo => todo.id !== id));
                window.location.reload();
            } catch (error) {
                console.error('Delete error: ', error);
            }
        }
    };

    const openUpdateModal = (todo) => {
        setSelectedTodo(todo);
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedTodo(null);
    };

    const handleUpdateTodo = async (updatedTodo) => {
        try {
            const response = await fetch(`http://localhost:8000/todo_list/${updatedTodo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTodo),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedTodoFromServer = await response.json();
            setTodos(todos.map(todo => (todo.id === updatedTodoFromServer.id ? updatedTodoFromServer : todo)));
            closeUpdateModal();
        } catch (error) {
            console.error('Update error: ', error);
        }
    };

    const getTodoLength = () => todos.length;
    const getCompletedTodos = () => todos.filter(todo => todo.status && todo.status.done_task).length;

    return (
        <>
            <Todo_update todos_completed={getCompletedTodos()} total_todos={getTodoLength()} />
            <Add_task />
            <table className="w-4/5 text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className='text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                        <th scope='col'>Title</th>
                        <th scope='col'>Description</th>
                        <th scope='col'>Due Date</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>UPDATE / Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map(todo => (
                        <tr key={todo.id}>
                            <td>{todo.title}</td>
                            <td>{todo.description}</td>
                            <td>{new Date(todo.deadline).toLocaleDateString()}</td>
                            <td>
                                {todo.status ? (
                                    <button
                                        className={`text-white ${todo.status.done_task ? 'bg-green-600' : 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800'} font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                                        onClick={() => updateStatus(todo.id, todo.status.done_task)}
                                        disabled={todo.status.done_task}
                                    >
                                        {todo.status.done_task ? 'Completed' : 'Pending'}
                                    </button>
                                ) : (
                                    'Status not available'
                                )}
                            </td>
                            <td>
                                <button
                                    className='text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                                    onClick={() => openUpdateModal(todo)}
                                >
                                    UPDATE
                                </button>
                                <button
                                    className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                                    onClick={() => del(todo.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isUpdateModalOpen && (
                <UpdateTaskModal
                    todo={selectedTodo}
                    onClose={closeUpdateModal}
                    onUpdate={handleUpdateTodo}
                />
            )}
        </>
    );
}

export default TableList;
