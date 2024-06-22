import React from 'react'

function Todo_update({ todos_completed, total_todos }) {
    return (
        <section className='flex flex-row border-white space-x-5 w-11/12 sm:w-96 border-2 mt-10 mb-7 h-60'>
            <div className="flex flex-col justify-center items-center w-1/2">
                <p>Task Done</p>
                <p>keep it up</p>
            </div>
            <div className="flex justify-center items-center w-1/2">
                <div className='bg-green-500 rounded-full h-2/3 w-full flex justify-center items-center mr-5'>
                    <p className='text-5xl'>
                        {todos_completed}/{total_todos}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Todo_update