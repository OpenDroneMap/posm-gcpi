import React from 'react';
import ExportButton from './ExportButton';

const Header = (props) => {
  return (
    <header className="header">
      <h1><span className='logo'></span>Ground Control Point Interface</h1>
      <ExportButton onClick={(evt)=>{props.onExportClick(evt);}}/>
    </header>
  );
}

export default Header;