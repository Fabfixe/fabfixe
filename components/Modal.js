import ReactDOM from 'react-dom'
const cn = require('classnames')

const Modal = (props) => (
  ReactDOM.createPortal(
    <div className='modal'>
      <div className={cn('modal-content', props.layout)}>
        <div onClick={ props.closeModal } className="close">✕</div>
        {props.children}
      </div>
    </div>,
    document.body
  )
)

export default Modal
