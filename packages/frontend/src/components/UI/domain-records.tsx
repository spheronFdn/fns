import React, { useState } from 'react'
import { ReactComponent as PlusIcon } from '../../assets/icons/plus-icon.svg'
import { ReactComponent as MinusIcon } from '../../assets/icons/minus-icon.svg'
import EditRecord from './edit-record'
import config from '../../config'
import DiscordIcon from '../../assets/icons/social-discord-icon.svg'
import TwitterIcon from '../../assets/icons/social-twitter-icon.svg'
import GithubIcon from '../../assets/icons/social-github-icon.svg'
import RedditIcon from '../../assets/icons/social-reddit-icon.svg'
import TelegramIcon from '../../assets/icons/social-telegram-icon.svg'

interface IProps {
  ownerAddress: string
  domainName: string
}

const DomainRecords = ({ ownerAddress, domainName }: IProps) => {
  const [showRecords, setShowRecords] = useState<boolean>(false)
  const [showAddressRecords, setShowAddressRecords] = useState<boolean>(false)
  const [showTextRecords, setShowTextRecords] = useState<boolean>(false)
  const [showSocialRecords, setShowSocialRecords] = useState<boolean>(false)

  const addressRecordList = [
    { id: 1, key: config.domainRecordsKey.address.FIL },
    { id: 2, key: config.domainRecordsKey.address.ETH },
    { id: 3, key: config.domainRecordsKey.address.BTC },
  ]

  const textRecordList = [
    { id: 1, key: config.domainRecordsKey.text.URL },
    { id: 2, key: config.domainRecordsKey.text.AVATAR },
    { id: 3, key: config.domainRecordsKey.text.EMAIL },
    { id: 4, key: config.domainRecordsKey.text.DESCRIPTION },
  ]

  const socialRecordList = [
    { id: 1, key: config.domainRecordsKey.social.DISCORD, img: DiscordIcon },
    { id: 2, key: config.domainRecordsKey.social.GITHUB, img: GithubIcon },
    { id: 3, key: config.domainRecordsKey.social.TWITTER, img: TwitterIcon },
    { id: 4, key: config.domainRecordsKey.social.REDDIT, img: RedditIcon },
    { id: 4, key: config.domainRecordsKey.social.TELEGRAM, img: TelegramIcon },
  ]

  return (
    <div className="result__container duration-500 transition ease-in-out delay-150 p-6 md:p-8 my-10">
      <div
        className="flex flex-row justify-between items-center cursor-pointer"
        onClick={() => setShowRecords(!showRecords)}
      >
        <h2 className="lg:text-lg text-base text-white font-medium">Records</h2>
        {showRecords ? (
          <MinusIcon
            onClick={() => setShowRecords(false)}
            className="unary__button ease-in-out"
          />
        ) : (
          <PlusIcon
            onClick={() => setShowRecords(true)}
            className="unary__button ease-in-out"
          />
        )}
      </div>
      {showRecords && (
        <div className="pt-7">
          <div
            className="flex flex-row justify-between items-center
               border-t border-gray-border
               py-7 cursor-pointer"
            onClick={() => setShowAddressRecords(!showAddressRecords)}
          >
            <h2 className="md:text-base text-sm text-gray-400 font-medium uppercase">
              Addresses
            </h2>
            {showAddressRecords ? (
              <MinusIcon
                onClick={() => setShowAddressRecords(false)}
                className="unary__button ease-in-out"
              />
            ) : (
              <PlusIcon
                onClick={() => setShowAddressRecords(true)}
                className="unary__button ease-in-out"
              />
            )}
          </div>
          {showAddressRecords && (
            <div className="pb-7 space-y-7">
              {addressRecordList.map((record) => (
                <EditRecord
                  recordKey={record.key}
                  ownerAddress={ownerAddress}
                  key={record.id}
                  img={null}
                  type="address"
                  domainName={domainName}
                />
              ))}
            </div>
          )}
          <div
            className="flex flex-row justify-between items-center
               border-t border-gray-border
               py-7 cursor-pointer"
            onClick={() => setShowTextRecords(!showTextRecords)}
          >
            <h2 className="md:text-base text-sm text-gray-400 font-medium uppercase">
              Text Records
            </h2>
            {showTextRecords ? (
              <MinusIcon
                onClick={() => setShowTextRecords(false)}
                className="unary__button ease-in-out"
              />
            ) : (
              <PlusIcon
                onClick={() => setShowTextRecords(true)}
                className="unary__button ease-in-out"
              />
            )}
          </div>
          {showTextRecords && (
            <div className="pb-7 space-y-7">
              {textRecordList.map((record) => (
                <EditRecord
                  recordKey={record.key}
                  ownerAddress={ownerAddress}
                  key={record.id}
                  img={null}
                  type="text"
                  domainName={domainName}
                />
              ))}
            </div>
          )}
          <div
            className="flex flex-row justify-between items-center
               border-t border-gray-border
               py-7 cursor-pointer"
            onClick={() => setShowSocialRecords(!showSocialRecords)}
          >
            <h2 className="md:text-base text-sm text-gray-400 font-medium uppercase">
              Social Records
            </h2>
            {showSocialRecords ? (
              <MinusIcon
                onClick={() => setShowSocialRecords(false)}
                className="unary__button ease-in-out"
              />
            ) : (
              <PlusIcon
                onClick={() => setShowSocialRecords(true)}
                className="unary__button ease-in-out"
              />
            )}
          </div>
          {showSocialRecords && (
            <div className="space-y-7">
              {socialRecordList.map((record) => (
                <EditRecord
                  recordKey={record.key}
                  ownerAddress={ownerAddress}
                  key={record.id}
                  img={record.img}
                  type="social"
                  domainName={domainName}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DomainRecords
