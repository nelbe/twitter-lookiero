import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../components/common/Button';

export function Follow({ title, styleClass, list, updateFollow }) {

    const getElements = (element, indx) => {
        return (
            <div key={indx} className='flex w-full mb-2'>
                <div className='w-9/12'>{element.name}</div>
                <div className='w-3/12'><Button onClick={() => updateFollow(element)} width='w-full' height='h-30'>Follow</Button></div>
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

Follow.propTypes = {
    title: PropTypes.string,
    styleClass: PropTypes.any,
    list: PropTypes.any,
    updateFollow: PropTypes.func
};