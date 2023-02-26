import React from 'react'
import PulseLoader from 'react-spinners/PulseLoader'

const Loader = () => {
  return (
    <PulseLoader
      color="#2A66F7"
      loading
      size={10}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )
}

export default Loader
