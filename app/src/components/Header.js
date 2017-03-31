import React from 'react';
import ExportButton from './ExportButton';

const Header = (props) => {
  let disabled = props.status === undefined ? true : false;

  return (
    <header className="header">
      <h1><span className='logo'></span>Ground Control Point Interface</h1>
      <ExportButton onClick={(evt)=>{props.onExportClick(evt);}} disabled={disabled}/>
    </header>
  );
}

export default Header;