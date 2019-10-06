import React from 'react';

function Message (props) {
    const {chat, user, message} = props;

    return (
        <div className='chat-message'>
            <div className='message-id'>{chat}:{user}</div>
            <div className='message-body'>{message}</div>
        </div>
    );
}

export default Message;