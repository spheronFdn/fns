import React from 'react'
import '../../../src/App.css'
import { ReactComponent as SuccessIcon } from '../../assets/icons/register-success.svg'

function RegisterModal() {
  const transactionSteps = [
    {
      step: 1,
      title: 'Transaction Signing',
      isSuccess: true,
      content:
        'Your wallet will open and you will be asked to confirm the first of two transactions required for registration. If the second transaction is not processed within 7 days of the first, you will need to start again from step',
    },
    {
      step: 2,
      title: 'Complete Registration',
      isSuccess: false,
      content:
        'Click register and your wallet will re-open. Only after the 2nd transaction is confirmed you will know if you got the name.',
    },
  ]

  return (
    <div className="register__modal">
      <div className="register__modal__content">
        <h2>Setting up the domain</h2>
        <h2 className="text-gray-unaryBorder">
          We are setting your domain, it will take some minutes, please hang on
          with us.
        </h2>
        {transactionSteps.map((step) => (
          <div className="register__modal__step">
            <div className="flex flex-wrap sm:flex-nowrap flex-row gap-5">
              {step.isSuccess ? (
                <SuccessIcon className="flex-shrink-0" />
              ) : (
                <div
                  className="h-7 w-7 rounded-full border-[3px] border-white/[0.10]
                  flex-shrink-0 flex items-center justify-center text-gray-unaryBorder"
                >
                  {step.step}
                </div>
              )}
              <div>
                <h2>{step.title}</h2>
                <h2 className="text-gray-unaryBorder text-sm">
                  {step.content}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RegisterModal
