import React, { useContext } from 'react'
import { MainContext } from '../../providers/Provider'
const TopButton = () => {
  const { onClickTop } = useContext(MainContext)
  return (
    <>
      <div className="rounded-full bg-yellow-400 h-16 w-16 hover:opacity-80 fixed bottom-5 right-5 " onClick={onClickTop}>
        <svg className="text-white object-cover p-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7"></path></svg>
      </div>
    </>
  )
}

export default TopButton
