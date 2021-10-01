import axios from 'axios'
import React, { ChangeEvent, TextareaHTMLAttributes, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MainContext } from '../providers/Provider'
import { Result } from './Result'
import { Footer } from './Footer'
import mainImage from '../assets/main.jpg'
import MainTitle from './animations/MainTitle'
import './Search.scss';
export const Search = () => {
  const { data, setData, text, setText, onClickTop, googleData, setGoogleData,targetFlagChangeReset } = useContext(MainContext);
  const appId = process.env.REACT_APP_RAKUTEN_API_KEY
  const [page, setPage] = useState(2)

  const onClickNextPage = ():void => {
    onClickRakutenAPINextPage()
    onClickGoogleAPINextPage()
    setPage(page + 1)
    setGooglePage(googlePage + 30)
  }

  const onClickRakutenAPINextPage = ():void => {
    axios.get("https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?", {
      params: {format: "json",
      keyword: text,
      applicationId: appId,
      page: page,
    }
    }).then((res) => {
      const newArray = [...data, ...dataArrangeRakutenAPI(res.data.Items)]
      setData(newArray);
    })
  }

  const onChangeTarget = (e: ChangeEvent<HTMLInputElement>) => {
    setText(() => e.target.value)
  }

  const onClickSearch = (): void => {
    onClickGetGoogleAPI();
    onClickGetRakutenAPI();
  }

  interface RakutenItems{
    Item:{
      title: string,
      author: string,
      itemUrl: string,
      largeImageUrl: string

    }
  }
  const dataArrangeRakutenAPI = (items: [RakutenItems]) => {
    const newArray: PreparedData[] = [];
    items.map((item, index: number) => {
      const oneItem = {
        title: item.Item.title,
        author: item.Item.author,
        itemUrl: item.Item.itemUrl,
        imageUrl: item.Item.largeImageUrl,
    }
    newArray.push(oneItem)
    })
    return newArray
  }

  interface GoogleItems{
    volumeInfo:{
      title: string,
      authors: string[],
      infoLink: string,
      imageLinks: {
        thumbnail: string
      }
    }
  }

  const dataArrangeGoogleAPI = (items: [GoogleItems]) => {
    const newArray: PreparedData[] = [];
    items.map((item, index: number) => {
      const oneItem = {
        title: item.volumeInfo.title,
        author:
          item.volumeInfo.authors == null ?
          "":
          item.volumeInfo.authors[0] ,
        itemUrl: item.volumeInfo.infoLink,
        imageUrl:
            item.volumeInfo.imageLinks == null ?
           "" :
           item.volumeInfo.imageLinks.thumbnail,
    }
    newArray.push(oneItem)
    })
    return newArray

  }

  interface PreparedData{
    title: string,
    author: string,
    itemUrl: string,
    imageUrl: string,
  }

  const onClickGetRakutenAPI= () => {
    axios.get("https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?", {
      params: {format: "json",
      keyword: text,
      applicationId: appId}
    }).then((res) => {
      setData(dataArrangeRakutenAPI(res.data.Items));
      setPage(2)
    })
  }

  const onClickGetGoogleAPI = () => {
    axios.get('https://www.googleapis.com/books/v1/volumes',{params:{
      q: `intitle:${text}`,
      maxResults: 30,
      startIndex: 0,
    }})
    .then((res) => {
      dataArrangeGoogleAPI(res.data.items)

      setGoogleData(dataArrangeGoogleAPI(res.data.items));
    })
  }

    const [googlePage, setGooglePage] = useState(30)


  const onClickGoogleAPINextPage = () => {
    axios.get('https://www.googleapis.com/books/v1/volumes',{params:{
      q: `intitle:${text}`,
      maxResults: 30,
      startIndex: googlePage,
    }})
    .then((res) => {
      if (res.data.items != null) {
        const newArray = [...googleData, ...dataArrangeGoogleAPI(res.data.items)]
        setGoogleData(newArray);

      }
    })
  }
  const [phoneTabsState, setPhoneTabsState] = useState(true)
  const onClickGoogleTabs = () => {
    setPhoneTabsState(true)
  }
  const onClickRakutenTabs = () => {
    setPhoneTabsState(false)
  }

  const getTopPosition = document.scrollingElement;
  window.onscroll = () => {
    const want = document.getElementById("want")
    if (getTopPosition === null || want === null){
      return
    }
    if(getTopPosition.scrollTop > 190){
      want.classList.add("fixed","top-0");
    } else if (getTopPosition.scrollTop < 190){
      want.classList.remove("fixed","top-0");
    }
  }
  useEffect(() => {
    if (document.getElementById("google-tab") === null){
      return
    }
    const googleElement = document.getElementById("google-tab")
    const rakutenElement = document.getElementById("rakuten-tab")
    if (googleElement === null || rakutenElement === null ){
      return
    }
    phoneTabsState &&
      googleElement.classList.add("bg-indigo-900","text-white");
      phoneTabsState &&
      rakutenElement.classList.remove("bg-indigo-900","text-white");

      !phoneTabsState &&
      googleElement.classList.remove("bg-indigo-900","text-white");
      !phoneTabsState &&
      rakutenElement.classList.add("bg-indigo-900","text-white");

  },[phoneTabsState])



  const styleJSX: React.CSSProperties ={
    marginBottom: "-2px"
  }


  return(
    <>
    <div>
        <div className="ml-2">
      <div className="flex justify-end ml-auto items-en xl:flex-nowrap md:flex-nowrap lg:flex-wrap mt-8 mr-4 mb-5">
        <div className="relative w-5/12 md:w-72 mr-2">
          <input value={text} onChange={onChangeTarget} type="text" placeholder="検索タイトルを入力！"
           className="bg-gray-200 w-full px-3 py-1 leading-8 text-black transition duration-500 ease-in-out transform border-transparent rounded-lg bg-blueGray-100 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2" />
        </div>
        <div className="flex">
        <button onClick={onClickSearch} className="px-3 md:px-6 py-2 font-medium text-white transition duration-500 ease-in-out transform bg-indigo-900  border-blue-600 rounded-md ext-base focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:bg-indigo-500 mr-3">
        SEARCH</button>
        <button onClick={targetFlagChangeReset} className="px-3 md:px-6 py-2 font-medium text-white transition duration-500 ease-in-out transform bg-yellow-300  rounded-md ext-base focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:bg-yellow-200 mr-3">
          RESET</button>
        </div>
        </div>
      </div>
      <div className="md:flex">
      <div className="md:hidden">

      <>

          {data.length !== 0 && googleData.length !== 0 &&
        <div id="want" className=" ml-4 z-50 bg-white w-full pt-2" style={styleJSX}>
          <div className="flex">
      <div>
      <div id="google-tab" onClick={onClickGoogleTabs}
       className="bg-white rounded-b-none border-t-2 border-r-2 border-l-2 border-gray-900 cursor-pointer w-32 text-center px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                Google
                {phoneTabsState &&
                <div className="border-b-4 opacity-0 border-purple-400 ">
                </div>
                }
                </div>

      </div>
      <div>
      <div id="rakuten-tab" onClick={onClickRakutenTabs}
       className="bg-white rounded-b-none border-t-2 border-r-2 border-l-2 border-gray-900 cursor-pointer w-32 text-center px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                Rakuten
                {!phoneTabsState &&
                <div className="border-b-4 opacity-0 border-purple-400 ">
                </div>
                }
                </div>

      </div>

          </div>
                <div className="border-t-2 border-gray-900  h-1 w-11/12 pr-2" style={styleJSX}></div>

        </div>
                 }
                {phoneTabsState ?

                <>
                <div className=" max-w-screen-md mx-auto">
                <Result data={googleData} apiName="Google"/>
                </div>
                </>

                :
                <>
                <div className=" max-w-screen-md mx-auto">
                  <Result data={data} apiName="Rakuten"/>
                  </div>
                </>
                }




</>

      </div>
      <div className="hidden md:block max-w-screen-md mx-auto">
      <Result data={googleData} apiName="Google"/>
      </div>
      <div className="hidden md:block max-w-screen-md mx-auto">
      <Result data={data} apiName="Rakuten"/>

      </div>

      </div>
      { data != "" ?
      <>
      <div className="flex items-center justify-center w-full">
      <div className="rounded-full  h-20 w-20 hover:opacity-80 mb-3"
      onClick={onClickNextPage}>
      <svg className="object-cover p-3 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </div>
      </div>
      </>
      :

      <>
        <div className="relative w-full ">

        <img src={mainImage} alt="memento time" className="mx-auto "/>
        <div className="w-screen z-10" style={{position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",}}>
              <div>

              <MainTitle />
              </div>
        </div>
        </div>
        </>


      }
      <div className="">

      <Footer />
      <div className="rounded-full bg-yellow-400 h-16 w-16 hover:opacity-80 fixed bottom-5 right-5 " onClick={onClickTop}>
      <svg className="text-white object-cover p-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7"></path></svg>

      </div>
      </div>
    </div>
      </>
  )
}
