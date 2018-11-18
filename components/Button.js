import '../button.scss'
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
    console.log()
    this.setState(state => ({
      isSelected: !state.isSelected
    }));
  }

  render() {
    const buttonClasses = cn('button', { "select": this.props.isSelect, "isSelected": this.state.isSelected })
    return (
      <div onClick={ this.handleClick }>
      <a onClick={this.props.onClick} className={ buttonClasses }>
        {this.props.children}
      </a>
      </div>
    )

  }

}

export default Button
