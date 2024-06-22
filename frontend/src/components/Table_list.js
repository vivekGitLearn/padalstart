// import React, { useState, useEffect } from 'react';

// function TableList() {
//     const [todos, setTodos] = useState([]);

//     useEffect(() => {
//         const fetchTodos = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/todo_list/');
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const content = await response.json();
//                 setTodos(content);
//             } catch (error) {
//                 console.error('Fetch error: ', error);
//             }
//         };

//         fetchTodos();
//     }, []);

//     const updateStatus = async (id, currentStatus) => {
//         try {
//             const response = await fetch(`http://localhost:8000/status_update/${id}?status_update=${!currentStatus}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const updatedTodo = await response.json();
//             setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
//         } catch (error) {
//             console.error('Update error: ', error);
//         }
//     }
//     const del = async id => {

//         if (window.confirm('Are you sure to delete this task?')) {
//             try {
//                 await fetch(`http://localhost:8000/todo_list/${id}`, {
//                     method: 'DELETE'
//                 });
//                 setTodos(todos.filter(todo => todo.id !== id));
//             } catch (error) {
//                 console.error('Delete error: ', error);
//             }
//         }
//     }

//     return (
//         <>
//             <table className="w-4/5 text-left rtl:text-right text-gray-500 dark:text-gray-400">
//                 <thead className='text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
//                     <tr>
//                         <th scope='col'>#</th>
//                         <th scope='col'>Title</th>
//                         <th scope='col'>Description</th>
//                         <th scope='col'>Due Date</th>
//                         <th scope='col'>Status</th>
//                         <th scope='col'>Delete</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {todos.map(todo => (
//                         <tr key={todo.id}>
//                             <td>{todo.id}</td>
//                             <td>{todo.title}</td>
//                             <td>{todo.description}</td>
//                             <td>{new Date(todo.deadline).toLocaleDateString()}</td>
//                             <td><button className='text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
//                                 onClick={() => updateStatus(todo.id, todo.status.done_task)}>{todo.status.done_task ? 'Completed' : 'Pending'}</button></td>
//                             <td>
//                                 <button className='text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
//                                 onClick={() => del(todo.id)}>Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </>
//     );
// }

// export default TableList;
import React, { useState, useEffect } from 'react';
import Add_task from './Add_task';
import Todo_update from './Todo_update';

function TableList() {
    const [todos, setTodos] = useState([]);
   
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
            console.log("this is id: ", id);
            setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
            console.log(updatedTodo);
            console.log(todos)
            window.location.reload()
        
        } catch (error) {
            console.error('Update error: ', error);
        }
    }

    const del = async id => {
        if (window.confirm('Are you sure to delete this task?')) {
            try {
                await fetch(`http://localhost:8000/todo_list/${id}`, {
                    method: 'DELETE'
                });
                setTodos(todos.filter(todo => todo.id !== id));
                window.location.reload()
            } catch (error) {
                console.error('Delete error: ', error);
            }
        }
    }
    const getTodoLength = () => todos.length;
    const getCompletedTodos = () => todos.filter(todo => todo.status && todo.status.done_task).length;

    
    return (
        <>
            <Todo_update todos_completed={getCompletedTodos()} total_todos={getTodoLength()} />
            <Add_task></Add_task>
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
                                    onClick={() => del(todo.id)}
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
        </>
    );
}

export default TableList;
