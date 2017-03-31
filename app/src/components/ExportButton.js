import React from 'react';

const ExportButton = (props) => {
    return <button className='export-btn' onClick={props.onClick} disabled={props.disabled}>Export file</button>
}

export default ExportButton;