/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button } from '../../components/UI/button'
import Loader from '../../components/Loader/loader'
import { ReactComponent as GlobeLogo } from '../../assets/icons/globe-icon.svg'
import { ReactComponent as CopyIcon } from '../../assets/icons/copy-icon.svg'
import { ReactComponent as EditIcon } from '../../assets/icons/edit-icon.svg'
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete-icon.svg'
import { copyToClipboard } from '../../lib/utils'
import EditSubdomain from '../../components/InputField/edit-subdomain'

const Subdomain = () => {
  const [searchQuery, isDomainAvailable, loading] =
    useOutletContext<
      [
        string,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        string,
        string,
        string,
        number,
        (step: number) => void,
        string,
        string,
        string,
        boolean,
        boolean,
        number,
        (year: number) => void,
        boolean,
        (succes: boolean) => void,
      ]
    >()

  // TODO - WILL BE RELEASED WHEN PACKAGE SUPPORT FOR SUBDOMAIN IS RELEASED
  // DUMMY DATA USED AS OF NOW
  const subdomainList = [
    { id: 1, name: 'spheronprotocol1' },
    { id: 2, name: 'spheronprotocol2' },
    { id: 3, name: 'spheronprotocol3' },
  ]

  const [addSubdomainName, setAddSubdomainName] = useState<string>('')
  const [addSubdomainEnabled, setAddSubdomainEnabled] = useState<boolean>(false)

  return (
    <>
      {loading ? (
        <div className="mt-24 mb-12">
          <Loader />
        </div>
      ) : (
        <>
          {!isDomainAvailable && (
            <>
              <div className="py-6 flex flex-row justify-between items-center">
                <h3 className="md:text-base text-sm text-gray-text text-left">
                  Subdomain list
                </h3>
                {!addSubdomainEnabled && (
                  <Button
                    disabled={false}
                    onClick={() => setAddSubdomainEnabled(true)}
                    className="uppercase md:text-sm text-xs flex flex-row items-center gap-1"
                  >
                    Add
                    <span className="text-2xl font-light">+</span>
                  </Button>
                )}
              </div>
              {addSubdomainEnabled && (
                <div
                  className="py-4 mb-6 border-t border-b border-gray-border
              flex flex-row flex-wrap gap-4 items-center"
                >
                  <EditSubdomain
                    classname=""
                    subdomainName={addSubdomainName}
                    editSubdomainName={setAddSubdomainName}
                    domainName={searchQuery}
                  />
                  <Button
                    disabled={false}
                    onClick={() => setAddSubdomainEnabled(false)}
                    className="uppercase md:text-sm text-xs flex flex-row items-center gap-1"
                    variant="cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={false}
                    onClick={() => null}
                    className="uppercase md:text-sm text-xs flex flex-row items-center gap-1"
                  >
                    Save
                  </Button>
                </div>
              )}

              <div className="space-y-7">
                {subdomainList.map((subdomain) => (
                  <div
                    className="flex flex-row items-center gap-3 justify-between"
                    key={subdomain.id}
                  >
                    <div className="flex flex-row items-center gap-3">
                      <GlobeLogo />
                      <h3 className="text-white md:text-base text-sm">
                        {subdomain.name}.
                        <span className="text-primary-textBlue">
                          {searchQuery}
                        </span>
                      </h3>
                      <CopyIcon
                        className="copy__button"
                        onClick={() => copyToClipboard(subdomain.name)}
                      />
                    </div>
                    <div className="flex flex-row gap-3">
                      <EditIcon className="copy__button" onClick={() => null} />
                      <DeleteIcon
                        className="copy__button"
                        onClick={() => null}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Subdomain
