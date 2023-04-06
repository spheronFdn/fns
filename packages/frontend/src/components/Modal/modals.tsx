import React, { useContext } from 'react'
import { ModalContext } from '../../context/modal-context'
import ExtendModal from './extend-modal'
import RegisterModal from './register-modal'

const Modals = () => {
  const ModalCntx = useContext<any>(ModalContext)
  const { modalOpen, modalType, modalOption } = ModalCntx
  if (modalType === 'registerDomain' && modalOpen) {
    return <RegisterModal step={modalOption} />
  }
  if (modalType === 'extendDomain' && modalOpen) {
    return <ExtendModal option={modalOption} />
  }

  return <></>
}

export default Modals
