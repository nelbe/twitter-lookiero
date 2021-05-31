import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../components/common/Button';

export function Following({ title, styleClass, list, updateFollowing }) {

    const getElements = (element, indx) => {
        return (
            <div key={indx} className='flex w-full mb-2'>
                <div className='w-9/12'>{element.name}</div>
                <div className='w-3/12'><Button width='w-full' onClick={() => updateFollowing(element)} height='h-30'>Unfollow</Button></div>
            </div>
        );
    };

    return (
        <div className={`w-full ${styleClass}`}>
            <p className={'mb-2'}>{title}</p>
            <div className="border border-1 p-2">
                {list.map((element, indx) => getElements(element, indx)) }
            </div>
        </div>
    );
}

Following.propTypes = {
    title: PropTypes.string,
    styleClass: PropTypes.any,
    list: PropTypes.array,
    updateFollowing: PropTypes.func
};