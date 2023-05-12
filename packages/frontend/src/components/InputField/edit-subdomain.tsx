import React, { useRef, useState } from 'react'
import { ReactComponent as GlobeLogo } from '../../assets/icons/globe-icon.svg'
import { Input } from './input'

interface IProps {
  classname: string
  domainName: string
  subdomainName: string
  editSubdomainName: (e: React.SetStateAction<string>) => void
}

function EditSubdomain({
  classname,
  domainName,
  subdomainName,
  editSubdomainName,
}: IProps) {
  const [inputFocus, setInputFocus] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // handleSearch()
    }
  }

  return (
    <div
      className={`${!!classname && classname} rounded-full
         border ${
           inputFocus
             ? 'border-blue-500'
             : 'border-gray-border hover:border-gray-300'
         }
        bg-black
        duration-200 ease-in-out
        flex flex-row items-center justify-between
        w-11/12 md:w-9/12 lg:w-5/12`}
    >
      <div className="w-3/4 flex flex-row items-center p-1">
        <GlobeLogo className="ml-4" />
        <Input
          value={subdomainName}
          onChange={(e) => editSubdomainName(e.target.value)}
          className="ml-3 md:h-6 lg:h-8 border-0 bg-transparent
        sm:text-base text-sm mr-2 md:mr-3 w-full"
          placeholder="subdomain name"
          ref={inputRef}
          onKeyUp={(e) => handleEnterPress(e)}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
      </div>
      <div
        className="w-1/4 h-10 text-white bg-gray-border
        flex items-center justify-center truncate px-2
        rounded-r-full"
      >
        .{domainName}
      </div>
    </div>
  )
}

export default EditSubdomain
