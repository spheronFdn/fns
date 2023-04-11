import React from 'react'
import { ReactComponent as PoweredBySpheronLogo } from '../../assets/icons/powered-by-spheron.svg'
import '../../App.scss'

const handleClick = () => {
  window.open('https://spheron.network/', '_blank')
}

function PoweredBySpheron() {
  return (
    <div className="powered__by__spheron" onClick={handleClick}>
      Powered by: <PoweredBySpheronLogo />
    </div>
  )
}

export default PoweredBySpheron
