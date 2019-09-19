import React, { Component } from 'react'
import Button from '../components/Button'

class ConfirmModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <div className="confirm-text">
          <p>{this.props.copy}</p>
        </div>
        <div className="confirm-container">
          <Button onClick={() => {this.props.onConfirm()}}>Yes</Button>
          <Button onClick={() => {this.props.onCancel()}}>Go Back</Button>
        </div>
      </React.Fragment>
    )
  }
}

export default ConfirmModal
