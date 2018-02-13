import React from 'react';
import classNames from 'classnames';

const gridSvg = (
  <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
);

const backArrowSvg = (
  <svg stroke="#fff" strokeWidth="2" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M 16 2 L 6 12 L 16 22"/>
  </svg>
);

export default (props) => {
  return (
    <button className={classNames('toggle-grid', {
      'to-editor': !props.imageSelected,
      'to-grid': props.imageSelected
    })} onClick={props.onClick}>
      {props.imageSelected ? backArrowSvg : gridSvg}
    </button>
  );
};
