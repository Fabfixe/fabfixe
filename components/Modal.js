import ReactDOM from 'react-dom'

const Modal = (props) => (
  ReactDOM.createPortal(
    <div className='modal'>
      <div className="modal-content">
        <div onClick={ props.closeModal } className="close">X</div>
        {props.children}
      </div>
    </div>,
    document.body
  )
)

export default Modal
