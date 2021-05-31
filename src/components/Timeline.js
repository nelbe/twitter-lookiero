import React from 'react';
import PropTypes from 'prop-types';

export function Timeline({ title, messages }) {
    const getMessages = (message, indx) => {
        return (
            <div key={indx} className='w-full mb-2 border border-1 p-2'>
                <div className='flex w-full'>
                    <div className='font-bold w-9/12'>{message.user}</div>
                    <p className='w-3/12 text-right'>{message.time}</p>
                </div>
                <div className='w-full'>{message.message}</div>
            </div>
        );
    };

    return (
        <div className="w-full h-500 mb-3">
            <p className='mb-2'>{title}</p>
            <div className="border border-1 p-2 h-460 overflow-y-auto">
                {messages.map((message, indx) => getMessages(message, indx)) }
            </div>
        </div>
    );
}

Timeline.propTypes = {
    title: PropTypes.string,
    messages: PropTypes.array
};