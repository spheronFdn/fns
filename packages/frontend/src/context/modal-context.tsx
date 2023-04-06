import React, { createContext, useState } from 'react'

export const ModalContext: any = createContext<any>({} as any)

const ModalContextProvider: any = ({ children }: any) => {
  const [modalOpen, setModalOpen] = useState(true)
  const [modalType, setModalType] = useState('')
  const [modalOption, setModalOption] = useState<any>()

  return (
    <ModalContext.Provider
      value={{
        modalOpen,
        setModalOpen,
        modalType,
        setModalType,
        modalOption,
        setModalOption,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}
export default ModalContextProvider
