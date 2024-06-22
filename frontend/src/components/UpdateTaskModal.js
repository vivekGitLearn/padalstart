import React, { useState } from 'react';
import axios from 'axios';

function UpdateTaskModal({ todo, onClose, onUpdate }) {
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description);
    const [deadline, setDeadline] = useState(new Date(todo.deadline).toISOString().slice(0, 16));

    const handleUpdateSubmit = (event) => {
        event.preventDefault();
        const updatedTodo = { ...todo, title, description, deadline };

        try {
            console.log(updatedTodo.id);
            console.log(title);
            console.log(description);
            console.log(deadline);
            const response = axios.put(`http://localhost:8000/todo_list/${updatedTodo.id}`, {
                title: title,
                description: description,
                deadline: deadline,
                status_id: 0
            });

            // If the request is successful
            console.log('Update successful:', response.data);
            onClose();
        } catch (error) {
            console.error('Update error: ', error);
        }
    };
    

    return (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center'>
            <div className='bg-gray-400 p-6 rounded shadow-lg w-96 rounded-xl'>
                <h2 className='text-xl mb-4'>Update Task</h2>
                <form className='text-black' onSubmit={handleUpdateSubmit}>
                    <div className='mb-4'>
                        <label htmlFor="title" className='block mb-2'>Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className='w-full p-2 border border-gray-300 rounded'
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="description" className='block mb-2'>Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='w-full p-2 border border-gray-300 rounded'
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="deadline" className='block mb-2'>Deadline</label>
                        <input
                            type="datetime-local"
                            id="deadline"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className='w-full p-2 border border-gray-300 rounded'
                        />
                    </div>
                    <div className='flex justify-end'>
                        <button
                            type="button"
                            onClick={onClose}
                            className='bg-red-500 text-white p-2 rounded mr-2'
                        >
                            Cancel
                        </button>
                        <button type="submit" className='bg-green-500 text-white p-2 rounded'>
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateTaskModal;
