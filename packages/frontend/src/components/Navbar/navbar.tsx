import React, { useContext, useState } from 'react'
import { ReactComponent as FNSLogo } from '../../assets/icons/fns-logo.svg'
import { ReactComponent as MetamaskIcon } from '../../assets/icons/metamask.svg'
import { ReactComponent as CopyIcon } from '../../assets/icons/copy-icon.svg'
import { ReactComponent as DownArrow } from '../../assets/icons/down-arrow.svg'
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
import {
  copyToClipboard,
  getMiddleEllipsis,
  truncateAddress,
} from '../../lib/utils'
import { useLocation, useNavigate } from 'react-router-dom'
import config from '../../config'
import SearchDomain from '../InputField/search-domain'

interface IDropdownOption {
  id: number
  label: string
  onClick: () => void
  icon: JSX.Element | null
}

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const Web3Cntx = useContext<any>(Web3Context)
  const {
    currentAccount,
    connectWallet,
    currentAccountName,
    disconnectWallet,
    userBalance,
  } = Web3Cntx

  const dropdownOptions: IDropdownOption[] = [
    {
      id: 1,
      label: getMiddleEllipsis(currentAccount),
      onClick: () => copyToClipboard(currentAccount),
      icon: <CopyIcon className="h-6 w-6 copy__button" />,
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
        <Button
          onClick={disconnectWallet}
          className="py-0.5 md:py-1 uppercase w-full text-xs"
        >
          Disconnect
        </Button>
      ),
    },
  ]

  const handleRedirect = () => {
    window.open(`${window.location.origin}/`, '_self')
  }

  const handleDomainClick = () => {
    if (!!currentAccountName) navigate(`/domain/${currentAccountName}/details`)
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between h-14 lg:h-20 border-gray-border border-b border-opacity-50 shadow-sm">
      <div className="flex justify-between items-center gap-8 w-11/12 lg:w-10/12 mx-auto">
        <div className="flex flex-row gap-8 lg:w-2/3">
          <div
            className="flex items-center justify-start cursor-pointer"
            onClick={handleRedirect}
          >
            <FNSLogo className="md:h-10 md:w-24 w-16" />
          </div>
          {location.pathname !== '/' && (
            <SearchDomain
              showBtn={false}
              classname="lg:flex hidden h-12 w-2/3"
            />
          )}
        </div>
        <div className="flex items-center space-x-3">
          {currentAccount ? (
            <>
              <div
                className="bg-gray-100 bg-opacity-5 rounded-full
              text-white text-xs md:text-sm font-bold 
              flex items-center justify-start"
              >
                <div className="pl-3 text-sm md:text-base">
                  {Number(userBalance).toFixed(2)}{' '}
                  {config.web3.NETWORK.nativeCurrency.symbol}
                </div>
                <div
                  className={`px-3 py-2.5 rounded-full ml-2.5 bg-gray-100 bg-opacity-10 text-xs lg:text-base
                 duration-100 ease-in-out
                  ${
                    !!currentAccountName
                      ? 'cursor-pointer hover:bg-opacity-20'
                      : ''
                  }`}
                  onClick={handleDomainClick}
                >
                  {currentAccountName
                    ? currentAccountName
                    : truncateAddress(currentAccount)}
                </div>
              </div>
              <DropdownMenu
                onOpenChange={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <DropdownMenuTrigger className="flex flex-row items-center gap-4 cursor-pointer">
                  <Avatar>
                    <AvatarImage
                      src={makeBlockie(currentAccount)}
                      alt="@avatar"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <DownArrow
                    className={
                      isDropdownOpen
                        ? 'rotate-180 duration-200'
                        : 'duration-200'
                    }
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-max md:w-52 border-white border-opacity-10">
                  {dropdownOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={option.onClick}
                      className={`flex flex-row justify-between p-3 md:p-4 text-white md:text-sm text-xs ${
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
              className="gap-x-2 rounded-full text-white uppercase text-xs p-3 md:p-5
              flex flex-row items-center"
              onClick={connectWallet}
            >
              <MetamaskIcon className="md:h-7 md:w-7 h-5 w-5" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
