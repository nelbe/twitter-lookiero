import React, { useState, useEffect } from 'react';
import { Timeline } from '../components/Timeline';
import { Following } from '../components/Following';
import { Follow } from '../components/Follow';
import users from '../json-api/users';
import messagesApi from '../json-api/messages';
import { Button } from '../components/common/Button';

export function Dashboard() {
    const unfollowingUsers = users.users[5].unfollowing;
    const followingUsers = users.users[5].following;
    const [unfollowing, setUnfollowing] = useState(unfollowingUsers);
    const [following, setFollowing] = useState(followingUsers);
    const [newMessage, setNewMessage] = useState();
    const [messages, setMessages] = useState(messagesApi.messages);

    useEffect(() => {
        // The correct way is to use and server service to get the users and the messages and set the states in the useEffect
    });

    const updateMessage = (message) => {
        setNewMessage(message);
    };

    const addMessage = () => {
        const today = new Date();
        const month = today.toLocaleString('default', { month: 'long' });
        const date = today.getDate()+' '+month;
        const tempMessage = {
            'id': messages.length + 1,
            'user': users.users[5].name,
            'message': newMessage,
            'time': date
        };
        messages.push(tempMessage);
        setMessages([...messages]);
    };

    const updateFollowing = (e) => {
        unfollowing.push(e);
        const unfollow = following.filter((item) => item.id !== e.id);
        setFollowing(unfollow);
        setUnfollowing(unfollowing);
    };

    const updateFollow = (e) => {
        following.push(e);
        const follow = unfollowing.filter((item) => item.id !== e.id);
        setFollowing(following);
        setUnfollowing(follow);
    };

    return (
        <div className='relative flex w-full h-full min-w-1280 mt-3'>
            <div className='w-3/12 h-500 pl-3'>
                { following ? <Following updateFollowing={(e) => updateFollowing(e)} styleClass='mb-6' list={following} title='Following'></Following> : ''}
                { unfollowing ? <Follow updateFollow={(e) => updateFollow(e)} title='Follow' list={unfollowing} ></Follow> : ''}
            </div>
            <div className='w-9/12 h-200 pl-6 pr-6'>
                {messages ? <Timeline title='Timeline' messages={messages}></Timeline> : ''}
                <p className='mt-3'>Post a new nessage</p>
                <div className='mt-3 border border-1 h-24'>
                    <textarea className={'w-full h-full p-2 resize-none'}
                        value={newMessage} onChange={(e) => updateMessage(e.target.value)} />
                </div>
                <div className='mt-4 w-full flex justify-end'>
                    <Button width='w-108' height='h-50' onClick={addMessage}>Post</Button>
                </div>
            </div>
        </div>
    );
}

Dashboard.propTypes = {};