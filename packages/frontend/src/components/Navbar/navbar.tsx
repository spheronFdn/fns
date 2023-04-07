import React, { useContext } from 'react'
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
import config from '../../config'

interface IDropdownOption {
  id: number
  label: string
  onClick: () => void
  icon: JSX.Element
}

const Navbar = () => {
  const Web3Cntx = useContext<any>(Web3Context)
  const { currentAccount, connectWallet, disconnectWallet, userBalance } =
    Web3Cntx
  const dropdownOptions: IDropdownOption[] = [
    {
      id: 1,
      label: 'Disconnect',
      onClick: disconnectWallet,
      icon: <LogOut className="mr-2 h-4 w-4" />,
    },
  ]

  const handleRedirect = () => {
    window.open(`${window.location.origin}/`, '_self')
  }

  return (
    <nav className="flex items-center justify-between h-14 lg:h-20 border-gray-border border-b border-opacity-50 shadow-sm">
      <div className="flex justify-between items-center w-11/12 lg:w-8/12 mx-auto">
        <div
          className="flex items-center justify-start cursor-pointer"
          onClick={handleRedirect}
        >
          <SpheronLogo className="h-11 lg:h-16 w-auto" />
        </div>
        <div className="flex items-center space-x-3">
          {currentAccount ? (
            <>
              <div className="bg-gray-100 bg-opacity-5  text-white text-sm font-bold flex items-center justify-start rounded-xl">
                <div className="rounded-xl pl-2.5 lg:pl-3 text-xs lg:text-base">
                  {Number(userBalance).toFixed(2)}{' '}
                  {config.web3.NETWORK.nativeCurrency.symbol}
                </div>
                <div className="py-1.5 px-2 lg:py-2 lg:px-3 rounded-xl ml-2.5 bg-gray-100 bg-opacity-10 text-xs lg:text-base">
                  {truncateAddress(currentAccount)}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={makeBlockie(currentAccount)}
                      alt="@avatar"
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
