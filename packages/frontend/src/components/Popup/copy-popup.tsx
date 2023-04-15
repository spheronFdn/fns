import React from 'react'
import '../../App.scss'

interface IProps {
  text: string
  classname: string
}

const CopyPopup = ({ text, classname }: IProps) => {
  return (
    <div
      className={`${
        !!classname && classname
      } absolute z-50 w-24 bg-[#434345] rounded-xl`}
    >
      <div
        className="-bottom-1.5 absolute w-3 h-3
                          bg-[#434345] transform rotate-45
                          focus:outline-none items-center"
        style={{
          left: `45%`,
        }}
      />
      <div className="py-2 px-2.5 w-full">
        <div className="text-white text-center text-xs font-medium whitespace-nowrap">
          {text}
        </div>
      </div>
    </div>
  )
}

export default CopyPopup
