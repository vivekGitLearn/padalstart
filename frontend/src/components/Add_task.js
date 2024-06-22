import React, { useState } from 'react'
import axios from 'axios'
function Add_task() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Title:', title);
        setIsModalOpen(true);
    };
    const handleModalSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Deadline:', deadline);
        try {
            const response = axios.post('http://localhost:8000/todo_list/', {
                title: title,
                description: description,
                deadline: deadline
            });
            console.log(response.data);
            window.location.reload()
        }
        catch (error) {
            console.error('error posting data: ', error);
        }
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        setDeadline('');
    };

    return (
        <>
            <form className='p-4 flex flex-row' onSubmit={handleSubmit}>
                <label htmlFor="title" className='block mb-2 flex mr-2'>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder='Write your next task'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-full p-2 border border-gray-300 rounded text-black'
                    />
                </label>
                <button type="submit" className='bg-blue-500 text-white p-2 rounded'>
                    Add
                </button>
            </form>

            {isModalOpen && (
                <div className='fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center'>
                    <div className='bg-gray-400 p-6 rounded shadow-lg w-96 rounded-xl'>
                        <h2 className='text-xl mb-4'>Add Task Details</h2>
                        <form className='text-black' onSubmit={handleModalSubmit}>
                            <div className='mb-4'>
                                <label htmlFor="description" className='block mb-2'>Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className='w-full p-2 border border-gray-300 rounded '
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
                                    onClick={() => setIsModalOpen(false)}
                                    className='bg-red-500 text-white p-2 rounded mr-2'
                                >
                                    Cancel
                                </button>
                                <button type="submit" className='bg-green-500 text-white p-2 rounded'>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}


export default Add_task;