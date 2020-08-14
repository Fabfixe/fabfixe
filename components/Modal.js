import { createPortal } from 'react-dom'
import { useRef, useEffect, useState } from 'react'
const cn = require('classnames')

const Modal = ({layout, containerClassName, closeModal, children}) => {
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? createPortal(
    <div className={cn('modal', containerClassName)}>
      <div className={cn('modal-content', layout)}>
        <div onClick={ closeModal } className="close">✕</div>
        {children}
      </div>
    </div>, document.body
  ) : null
}

export default Modal
