import React, { Component } from 'react'
import Button from '../components/Button'

class ConfirmModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='confirm-modal'>
        <div className="confirm-container">
          <div className="confirm-text">
            <p>{this.props.copy}</p>
          </div>
          <div className="confirm-modal__buttons">
            <Button onClick={() => {this.props.onConfirm()}}>Yes</Button>
            <Button onClick={() => {this.props.onCancel()}}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default ConfirmModal
