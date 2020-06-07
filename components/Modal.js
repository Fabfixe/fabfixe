import { createPortal } from 'react-dom'
import { useRef, useEffect, useState } from 'react'
const cn = require('classnames')

const Modal = (props) => {
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? createPortal(
    <div className='modal'>
      <div className={cn('modal-content', props.layout)}>
        <div onClick={ props.closeModal } className="close">✕</div>
        {props.children}
      </div>
    </div>, document.body
  ) : null
}

export default Modal
