import React from 'react'

const Test = () => {
  return (
    <div>
        <div>Borders</div>
        <div className='w-10 h-4 border text-green-500 !border-green-500' />
        <div className='w-10 h-4 border text-red-500 !border-red-500' />
        <div className='w-10 h-4 border text-yellow-500 !border-yellow-500' />
        <div className='w-10 h-4 border text-gray-500 !border-gray-500' />
        <div className='w-10 h-4 border text-gray-500 !border-gray-500' />
    </div>
  )
}

export default Test