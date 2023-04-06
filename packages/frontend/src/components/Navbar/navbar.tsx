import React, { useContext, useState } from 'react'
import { ReactComponent as SpheronLogo } from '../../assets/icons/spheron-logo.svg'
import { ReactComponent as MetamaskIcon } from '../../assets/icons/metamask.svg'
import { ReactComponent as CopyIcon } from '../../assets/icons/copy-icon.svg'
import { ReactComponent as DownArrow } from '../../assets/icons/down-arrow.svg'
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
import { copyToClipboard, truncateAddress } from '../../lib/utils'
import SearchDomain from '../UI/search-domain'
import { useLocation, useNavigate } from 'react-router-dom'

interface IDropdownOption {
  id: number
  label: string
  onClick: () => void
  icon: JSX.Element | null
}

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  console.log('yee location -', location.pathname)
  const Web3Cntx = useContext<any>(Web3Context)
  const {
    currentAccount,
    connectWallet,
    currentAccountName,
    disconnectWallet,
    userBalance,
  } = Web3Cntx

  const leftHalf = currentAccount?.slice(0, Math.ceil(9 / 2) - 1)
  const rightHalf = currentAccount?.slice(
    currentAccount?.length - Math.floor(9 / 2) + 1,
  )

  const accountAddrEllipsis = leftHalf + '...' + rightHalf

  const dropdownOptions: IDropdownOption[] = [
    {
      id: 1,
      label: accountAddrEllipsis,
      onClick: () => copyToClipboard(currentAccount),
      icon: <CopyIcon className="h-6 w-6 cursor-pointer" />,
    },
    {
      id: 2,
      label: 'My Account',
      onClick: () => navigate('/myaccount'),
      icon: null,
    },
    {
      id: 3,
      label: '',
      onClick: () => null,
      icon: (
        <Button onClick={disconnectWallet} className="py-1 uppercase w-full">
          Disconnect
        </Button>
      ),
    },
  ]

  const handleRedirect = () => {
    window.open(`${window.location.origin}/`, '_self')
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between h-14 lg:h-20 border-gray-border border-b border-opacity-50 shadow-sm">
      <div className="flex justify-between items-center w-11/12 lg:w-8/12 mx-auto">
        <div
          className="flex items-center justify-start cursor-pointer"
          onClick={handleRedirect}
        >
          <SpheronLogo className="h-10 w-24" />
        </div>
        {location.pathname !== '/' && <SearchDomain showBtn={false} />}
        <div className="flex items-center space-x-3">
          {currentAccount ? (
            <>
              <div
                className="bg-gray-100 bg-opacity-5 rounded-full
              text-white text-sm font-bold 
              flex items-center justify-start"
              >
                <div className="pl-3 text-base">
                  {Number(userBalance).toFixed(2)} tFIL
                </div>
                <div className="px-3 py-2.5 rounded-full ml-2.5 bg-gray-100 bg-opacity-10 text-xs lg:text-base">
                  {currentAccountName
                    ? currentAccountName
                    : truncateAddress(currentAccount)}
                </div>
              </div>
              <Avatar>
                <AvatarImage src={makeBlockie(currentAccount)} alt="@avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <DropdownMenu
                onOpenChange={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <DropdownMenuTrigger>
                  <DownArrow
                    className={
                      isDropdownOpen
                        ? 'rotate-180 duration-200'
                        : 'duration-200'
                    }
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="right-50 w-52 border-white border-opacity-10">
                  {dropdownOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={option.onClick}
                      className={`flex flex-row justify-between P-4 text-white ${
                        option.id === 2 ? 'cursor-pointer' : ''
                      } ${
                        option.id !== 3
                          ? 'border-b border-white border-opacity-10 focus:bg-[#1e1e20]'
                          : ''
                      }
                      `}
                    >
                      {option.label}
                      {option.icon}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              variant="navbar"
              className="gap-x-2 rounded-full text-white uppercase text-sm p-5"
              onClick={connectWallet}
            >
              <MetamaskIcon className="h-7 w-7" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
