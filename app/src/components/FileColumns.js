import React, { Component } from 'react';

const Select = (props) => {
  return (
    <select>
      <option key='null' value=''/>
      {
        props.selectOptions.map((d,i) => {

          if (props.tryDefault && i === props.idx) {
            return (<option key={d} value={d} selected='selected'>{d}</option>);
          }
          return (<option key={d} value={d}>{d}</option>);
        })
      }

    </select>
  );
}

const Column = (props) => {
  return (
    <li><Select {...props}/></li>
  );
}

export default class FileColumns extends Component {
  constructor(props) {
    super(props);
  }

  renderColumns() {
    const {columns} = this.props;

    const tryDefault = columns.length === 6;

    return columns.map((d,i) => {
      return (
        <Column key={i} idx={i} {...this.props} tryDefault={tryDefault}/>
      );
    });
  }

  onSubmit(evt) {
    evt.preventDefault();

    const { onColumnsSubmit } = this.props;
    const selects = document.querySelector('.file-columns').querySelectorAll('select');

    const schema = {};

    for (let i=0; i < selects.length; i++) {
      const value = selects[i].value;
      if (value && value.length) schema[value] = i;
    }

    if (typeof onColumnsSubmit === 'function') onColumnsSubmit(schema);
  }

  render(){
    return (
      <div className='file-columns'>
        <h3>Assign Column Types</h3>
        <ol>
          {this.renderColumns()}
        </ol>
        <button onClick={(evt) => {this.onSubmit(evt);}}>Finish</button>
      </div>
    );
  }
}