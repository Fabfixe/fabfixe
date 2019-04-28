import React, { Component } from 'react'

const Modal = (props) => (
  <div className='modal'>
    <div onClick={ props.handleModal } className="close">X</div>
    <div className="center">
      <div className="modal-content">
        {props.children}
      </div>
    </div>
  </div>
)

export default Modal
