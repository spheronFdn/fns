import React, { useContext } from 'react'
import '../../../src/App.scss'
import { ReactComponent as SuccessIcon } from '../../assets/icons/register-success.svg'
import { ModalContext } from '../../context/modal-context'

function RegisterModal({ step }: any) {
  const ModalCntx = useContext<any>(ModalContext)
  const { setModalOpen } = ModalCntx

  const transactionSteps = [
    {
      step: 1,
      title: 'Transaction Signing',
      content:
        'Your wallet will open and you will be asked to confirm the first of two transactions required for registration. If the second transaction is not processed within 7 days of the first, you will need to start again from step',
    },
    {
      step: 2,
      title: 'Complete Registration',
      content:
        'Click register and your wallet will re-open. Only after the 2nd transaction is confirmed you will know if you got the name.',
    },
  ]

  interface ITransactionStepContainerProps {
    stepOptions: {
      step: number
      title: string
      content: string
    }
    loading: boolean
    success: boolean
    show: boolean
  }

  const TransactionStepContainer = ({
    stepOptions,
    loading,
    success,
    show,
  }: ITransactionStepContainerProps) => {
    return (
      <>
        {show && (
          <div className="register__modal__step">
            <div className="flex flex-wrap sm:flex-nowrap flex-row gap-5">
              {success && <SuccessIcon className="flex-shrink-0" />}
              {loading && !success && (
                <div
                  className="h-7 w-7 rounded-full border-[3px] border-t-[#0057ff] animate-spin
                  flex-shrink-0 flex items-center justify-center"
                />
              )}
              <div className="space-y-2">
                <h2 className="md:text-base text-sm">{stepOptions.title}</h2>
                <h2 className="md:text-sm text-xs text-gray-unaryBorder">
                  {stepOptions.content}
                </h2>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  const handleClose = (e: any) => {
    if (e.target.classList.contains('modal')) {
      setModalOpen(false)
    }
  }

  return (
    <div className="register__modal modal" onClick={(e) => handleClose(e)}>
      <div className="register__modal__content">
        <h2 className="md:text-base text-sm">Setting up the domain</h2>
        <h2 className="text-gray-unaryBorder md:text-sm text-xs mt-2">
          We are setting your domain, it will take some minutes, please hang on
          with us.
        </h2>
        <TransactionStepContainer
          stepOptions={transactionSteps[0]}
          show
          loading={step === 1}
          success={step > 1}
        />
        <TransactionStepContainer
          stepOptions={transactionSteps[1]}
          show={step > 1}
          loading={step === 2}
          success={step > 2}
        />
      </div>
    </div>
  )
}

export default RegisterModal
