import ReactDOM from 'react-dom'

const Modal = (props) => (
  ReactDOM.createPortal(
    <div className='modal'>
    <div onClick={ props.closeModal } className="close">X</div>
      <div className="modal-content">
        {props.children}
      </div>
    </div>,
    document.body
  )
)

export default Modal
