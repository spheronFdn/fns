import React, { useContext, useEffect, useState } from 'react'
import { ReactComponent as SpheronLogo } from '../../assets/icons/spheron-logo.svg'
import { LogOut } from 'lucide-react'
import makeBlockie from 'ethereum-blockies-base64'
import { Avatar, AvatarFallback, AvatarImage } from '../UI/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../UI/dropdown-menu'
import { Web3Context } from '../../context/web3-context'
import { Button } from '../UI/button'
import { truncateAddress } from '../../lib/utils'
import { isAvailable } from '../../services/spheron-fns'

interface IDropdownOption {
  id: number
  label: string
  onClick: () => void
  icon: JSX.Element
}

const Navbar = () => {
  const Web3Cntx = useContext<any>(Web3Context)
  const [av, setAv] = useState<boolean>(false)
  const { currentAccount, connectWallet, disconnectWallet } = Web3Cntx
  const dropdownOptions: IDropdownOption[] = [
    {
      id: 1,
      label: 'Disconnect',
      onClick: disconnectWallet,
      icon: <LogOut className="mr-2 h-4 w-4" />,
    },
  ]

  useEffect(() => {
    async function getAvailibility() {
      let response = await isAvailable(currentAccount)
      setAv(!!response)
    }
    if (currentAccount) {
      getAvailibility()
    }
  }, [currentAccount])

  console.log(av)

  return (
    <nav className="flex items-center justify-between h-16 border-slate-200 border-b border-opacity-50 shadow-sm">
      <div className="flex justify-between items-center w-8/12 mx-auto">
        <div className="flex items-center justify-start">
          <SpheronLogo />
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700">
            Spheron
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          {currentAccount ? (
            <>
              <div className="bg-slate-100 rounded-md py-1.5 px-2 text-xs font-normal">
                {truncateAddress(currentAccount)}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={makeBlockie(currentAccount)}
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="right-50">
                  {dropdownOptions.map((option) => (
                    <DropdownMenuItem key={option.id} onClick={option.onClick}>
                      {option.icon}
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={connectWallet}>Connect</Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
