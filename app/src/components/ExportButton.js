import React from 'react';

const ExportButton = (props) => {
    return <button className='export-btn' onClick={props.onClick}>Export file</button>
}

export default ExportButton;