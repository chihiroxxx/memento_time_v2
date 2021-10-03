import axios from 'axios'
import React, { ChangeEvent, TextareaHTMLAttributes, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { MainContext } from '../providers/Provider'
import { Result } from './Result'
import { Footer } from './Footer'
import './Search.scss';
import { Tooltip } from '@chakra-ui/react'
import TopButton from './atoms/TopButton'
import { Spinner } from "@chakra-ui/react"
import MainImage from './MainImage'

export const Search = () => {
  const { railsUrl, data, setData, text, setText, googleData, setGoogleData,targetFlagChangeReset,tsutayaData,setTsutayaData,kinoData, setKinoData,kinoArrangeData, setKinoArrangeData } = useContext(MainContext);
  const appId = process.env.REACT_APP_RAKUTEN_API_KEY

  const [page, setPage] = useState(2)

  const onClickNextPage = ():void => {
    onClickRakutenAPINextPage()
    onClickGoogleAPINextPage()
    onClickGetGoTsutayaAPINextPage()
    onClickGetGoKinoAPINextPage()
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
    setData([])
    setGoogleData([])
    setTsutayaData([])
    setKinoData([])
    setPage(2)
    setGooglePage(30)
    setKinoPage(1)
    setKinoArrangeData([])


    onClickGetGoogleAPI();
    onClickGetRakutenAPI();
    onClickGetGoTsutayaAPI();
    onClickGetGoKinoAPI();
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
    if (items != null){
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
    })}
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
      if (res.data != null){
      dataArrangeGoogleAPI(res.data.items)

      setGoogleData(dataArrangeGoogleAPI(res.data.items))}
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

  const onClickGetGoTsutayaAPINextPage =() =>{
    axios.get(`${railsUrl}/tsutaya?`,{params:
    {q: text,
      page:  page,     }}).then((res)=> {
      if (res.data.items != null) {
        const newArray = [...tsutayaData, ...res.data.items]

        setTsutayaData(newArray)

      }
                })
  }
  const [kinoPage, setKinoPage] = useState(1)
  const onClickGetGoKinoAPINextPage = ()=>{
    axios.get(`${railsUrl}/kino?`,{params:
    {q: text,
      page: kinoPage,
    }}).then((res)=> {
      if (res.data.items != null) {
        const newArray = [...kinoData, ...res.data.items]
        setKinoData(newArray)

      }
    })
    console.log( Math.floor(kinoPage / 2) + 1)


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



  const styleJSX: React.CSSProperties ={
    marginBottom: "-2px"
  }


  const onClickGetGoKinoAPI = ()=>{
    axios.get(`${railsUrl}/kino?`,{params:
    {q: text,
      page: kinoPage,     }}).then((res)=> {
      if (res.data.items != null) {
      setKinoData(res.data.items)
                      }
        })

  }
  const onClickGetGoTsutayaAPI = ()=>{
    axios.get(`${railsUrl}/tsutaya?`,{params:
    {q: text,
      page:  page - 1,     }}).then((res)=> {
      if (res.data.items != null) {
      setTsutayaData(res.data.items)
            }
    })
  }


  const [tabStatus, setTabStatus] = useState(0)

interface TabState {
    elementName : string
}
const tabItems : TabState[] = [{elementName: "google-tab"},
                                {elementName: "rakuten-tab"},
                                {elementName: "tsutaya-tab"},
                                {elementName: "kinokuniya-tab"}]
const tabClasses : string[] = ["bg-indigo-900","text-white"]

useEffect(() => {
  if (document.getElementById(tabItems[0].elementName) !== null){
  switch (tabStatus){
    case 0:
      tabItems.forEach((item,index)=>{
        if(index === 0){
          document.getElementById(item.elementName)!.classList.add(tabClasses[0],tabClasses[1]);
        }
        else{
          document.getElementById(item.elementName)!.classList.remove(tabClasses[0],tabClasses[1]);

        }
      })
      break
    case 1:
      tabItems.forEach((item,index)=>{
        if(index === 1){
          document.getElementById(item.elementName)!.classList.add(tabClasses[0],tabClasses[1]);
        }
        else{
          document.getElementById(item.elementName)!.classList.remove(tabClasses[0],tabClasses[1]);

        }
      })
      break
    case 2:
      tabItems.forEach((item,index)=>{
        if(index === 2){
          document.getElementById(item.elementName)!.classList.add(tabClasses[0],tabClasses[1]);
        }
        else{
          document.getElementById(item.elementName)!.classList.remove(tabClasses[0],tabClasses[1]);

        }
      })
      break
    case 3:
      tabItems.forEach((item,index)=>{
        if(index === 3){
          document.getElementById(item.elementName)!.classList.add(tabClasses[0],tabClasses[1]);
        }
        else{
          document.getElementById(item.elementName)!.classList.remove(tabClasses[0],tabClasses[1]);

        }
      })
      break
  }}
},[tabStatus])

  const kinoArrange = () => {

    if (kinoData.length !== 0){

                                          const i = (Math.floor(kinoPage / 2) + 1)
      console.log(i * 30)
      const arr = kinoData.slice(0,30 * i)
      setKinoArrangeData(arr)
      console.log(arr)
                  setKinoPage(kinoPage + 2)
    }
  }
  useEffect(()=> kinoArrange(),[kinoData])
    console.log(kinoArrangeData)





  const cb = (entris:any, observer:any) => {
    console.log("intersecting!!!?")
    entris.forEach((entry:any) => {
      if(entry.isIntersecting) {
        console.log("inview!!")
        console.log(entry.target)
        entry.target.classList.add("viewing")

      }else{
        console.log("outview!!")



      }
    })
  }
  const options = {
      }
  const io = new IntersectionObserver(cb, options)



  const watchScroll = () => {
    const els = document.querySelectorAll('.scrolled')
    console.log(els)
    els.forEach(el => io.observe(el))

  }
useEffect(watchScroll,[googleData, data, kinoData, tsutayaData])

const [isLoading, setIsLoading] = useState(false)

  return(
    <>
    <div>

      <div className="ml-2 search-ber-right-up">
      <div className="flex justify-end ml-auto items-en xl:flex-nowrap md:flex-nowrap lg:flex-wrap mt-8 mr-4 mb-5">
      <Tooltip label="検索したい本のタイトルを入力してください！" closeDelay={500}

      placement="bottom-start">
        <div className="relative w-5/12 md:w-72 mr-2">
          <input value={text} onChange={onChangeTarget} type="text" placeholder="検索タイトルを入力！"
           className="bg-gray-200 w-full px-3 py-1 leading-8 text-black transition duration-500 ease-in-out transform border-transparent rounded-lg bg-blueGray-100 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2" />
        </div>
        </Tooltip>
        <div className="flex">
        <button onClick={onClickSearch} className="px-3 md:px-6 py-2 font-medium text-white transition duration-500 ease-in-out transform bg-indigo-900  border-blue-600 rounded-md ext-base focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:bg-indigo-500 mr-3">
        SEARCH</button>
        <button onClick={targetFlagChangeReset} className="px-3 md:px-6 py-2 font-medium text-white transition duration-500 ease-in-out transform bg-yellow-300  rounded-md ext-base focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:bg-yellow-200 mr-3">
          RESET</button>

        </div>
        </div>
      </div>


    {/* Result画面 */}

      <div className="md:flex">

      <div className="md:hidden">

      <>


          {data.length !== 0 && googleData.length !== 0 &&
        <div id="want" className=" ml-4 z-50 bg-white w-full pt-2" style={styleJSX}>
          <div className="flex">
      <div>

      <div id="google-tab" onClick={()=>setTabStatus(0)}
       className="bg-white rounded-b-none border-t-2 border-r-2 border-l-2 border-gray-900 cursor-pointer w-20 text-center px-1 py-1 mr-1 text-xs text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                Google

                </div>

      </div>
      <div>
      <div id="rakuten-tab" onClick={()=>setTabStatus(1)}
       className="bg-white rounded-b-none border-t-2 border-r-2 border-l-2 border-gray-900 cursor-pointer w-20 text-center px-1 py-1 mr-1 text-xs text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                Rakuten

                </div>

      </div>
      <div>

      <div id="tsutaya-tab" onClick={()=>setTabStatus(2)}
       className="bg-white rounded-b-none border-t-2 border-r-2 border-l-2 border-gray-900 cursor-pointer w-20 text-center px-1 py-1 mr-1 text-xs text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                TSUTAYA

                </div>

      </div>
      <div>

      <div id="kinokuniya-tab" onClick={()=>setTabStatus(3)}
       className="bg-white rounded-b-none border-t-2 border-r-2 border-l-2 border-gray-900 cursor-pointer w-20 text-center px-1 py-1 mr-1 text-xs text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                Kinokuniya

                </div>

      </div>

          </div>
                <div className="border-t-2 border-gray-900  h-1 w-11/12 pr-2" style={styleJSX}></div>

        </div>
                 }



                {
                  tabStatus === 0 &&
                  <>
                <div className="max-w-screen-md mx-auto">
                <Result data={googleData} apiName="Google"/>
                </div>
                </>
                }
                {
                  tabStatus === 1 &&
                  <>
                <div className=" max-w-screen-md mx-auto">
                  <Result data={data} apiName="Rakuten"/>
                  </div>
                </>
                }
                {
                  tabStatus === 2 &&
                  <>
                <div className=" max-w-screen-md mx-auto">
                <Result data={tsutayaData} apiName="TSUTAYA"/>
                  </div>
                </>
                }
                {
                  tabStatus === 3 &&
                  <>
                <div className=" max-w-screen-md mx-auto">
                <Result data={kinoArrangeData} apiName="Kinokuniya"/>

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
      <div className="hidden md:block max-w-screen-md mx-auto">
      <Result data={tsutayaData} apiName="TSUTAYA"/>
      </div>
      <div className="hidden md:block max-w-screen-md mx-auto">
      <Result data={kinoArrangeData} apiName="Kinokuniya"/>
      </div>

      </div>
      { data.length !== 0 ?
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
        <MainImage/>

        </>


      }
      <div className="">

      <Footer />

      <TopButton />
      </div>
    </div>
      </>
  )
}
