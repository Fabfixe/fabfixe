import React, { Component } from 'react'
const cn = require('classnames')

class Button extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSelected: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isSelected: !state.isSelected
    }));
  }

  render() {
    const buttonClasses = cn('button', { "select": this.props.isSelect, "isSelected": this.state.isSelected })
    return (
      <div style={this.props.containerStyle} onClick={ this.handleClick }>
      <button disabled={this.props.disabled} type={ this.props.type } form={ this.props.form } onClick={this.props.onClick} className={ buttonClasses }>
        {this.props.children}
      </button>
      </div>
    )
  }
}

export default Button
