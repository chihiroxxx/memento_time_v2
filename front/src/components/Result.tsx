import axios from 'axios'
import React, { ChangeEvent, useContext, useState } from 'react'
import styled from 'styled-components'
import { MainContext } from '../providers/Provider'
import { Modal } from './organisms/Modal'


interface Props{
  data: PreparedData[]
  apiName: string
}

interface PreparedData{
  title: string,
  author: string,
  itemUrl: string,
  imageUrl: string,
}

export const Result = (props: Props) => {
  const { setData, setText, configAxios, railsUrl, userId, targetFlagChangeReset, targetItem, setTargetItem, onClickPostRails, setTime , idea, setIdea
  ,targetFlag, setTargetFlag} = useContext(MainContext);

  const {data, apiName} = props
  const targetFlagChange = () => {
    setTargetFlag(() => true);
  }
  const onChangeIdea = (e: ChangeEvent<HTMLInputElement>) => {
    setIdea(() => e.target.value)
  }
  const onClickTargetItem = (e: TargetItem) => {
    const Target = {title: e.title, author: e.author, imageUrl: e.imageUrl}
    setTargetItem(Target)
    targetFlagChange()
  }



  axios.interceptors.request.use(
    config => {

      return config
    }
  )

  axios.interceptors.response.use(response => {

    return response
  })
  const onChangeTime = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(() => e.target.valueAsNumber)
  }

  interface TargetItem {
    title: string;
    author: string;
    imageUrl: string;
    itemUrl: string;
  }

  const styleJSX: React.CSSProperties ={
    marginTop: "-2px"
  }


  return(
    <SContainer>

        {data.length !== 0 &&
        <>
        <div className="hidden md:block">

        <div
       className="bg-indigo-900 text-white cursor-default rounded-b-none border-t-2 border-r-2 border-l-2 border-gray-900  w-32 text-center px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                {apiName}
                </div>
                <div className="border-t-2 border-gray-900  h-1 w-11/12 pr-2" style={styleJSX}></div>
        </div>

      <ul>
        {data.map((item, index) => {
          return(
        <div className="m-3 inline-block ">
        <div key={index} className="overflow-hidden shadow-lg rounded-lg h-90 w-72 cursor-pointer ml-1 hover:opacity-85">
            <a className="w-full block h-full">
              <div className="h-80">
                <a href={item.itemUrl} target="_blank" rel="noopener noreferrer">
                <img alt="NO IMAGE" src={item.imageUrl} className="max-h-full w-full object-cover"/>

                </a>

              </div>
                <div className="bg-white dark:bg-gray-800 w-full p-4">
                    <p className="text-indigo-500 text-md font-medium">
                        {apiName}Book
                    </p>
                    <div className="h-32 relative p-2">

                    <p className="text-gray-800 dark:text-white text-base font-medium mb-2">
                    { item.title }
                    </p>
                    <p className="text-gray-400 dark:text-gray-300 font-light text-md">
                    { item.author }
                    </p>
                    <div onClick={() => onClickTargetItem(item)}
                     className="object-cover rounded-full bg-indigo-600 h-10 w-10 hover:opacity-80 absolute top-20 right-0">
                    <svg className="text-white object-cover p-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>

                    </div>
                    </div>
                </div>
            </a>
        </div>
        </div>


              );
        })}
      </ul>
        </>

      }

      { targetFlag &&
        <>
        <Modal indexFlag={false}/>
      </>
      }
    </SContainer>
  )
}

const SContainer = styled.div`
  margin: 10px 10px;
`
