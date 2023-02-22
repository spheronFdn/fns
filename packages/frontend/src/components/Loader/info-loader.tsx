import React from 'react'
import { ClipLoader } from 'react-spinners'

const InfoLoader = () => {
  return (
    <ClipLoader
      color="#334155"
      loading
      size={15}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )
}

export default InfoLoader
