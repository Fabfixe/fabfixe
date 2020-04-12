import ReactDOM from 'react-dom'
const cn = require('classnames')

const Modal = (props) => (
  ReactDOM.createPortal(
    <div className='modal'>
    <div onClick={ props.closeModal } className="close">X</div>
      <div className={cn('modal-content', props.layout)}>
        {props.children}
      </div>
    </div>,
    document.body
  )
)

export default Modal
