import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ disabled, onClick, width, height, children }) => {
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
    };

    const widthClass = width ? width : 'w-full';
    const heightClass = height ? height : 'h-20';
    const className = `${widthClass} ${heightClass} flex uppercase font-bold justify-center items-center text-center bg-blue-400  text-white border border-1 border-white hover:text-blue-400  hover:bg-white focus:outline-none hover:border-blue-400  text-xs p-1 rounded-md`;

    return (
        <button className={className} onClick={handleClick} disabled={disabled}>
            {children}
        </button>
    );
};

Button.propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    width: PropTypes.string,
    height: PropTypes.string,
    children: PropTypes.any
};

export { Button };

/** Example **/
// <DownloadButton onClick={} />