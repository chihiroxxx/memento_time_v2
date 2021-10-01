import axios from 'axios';
import React, { createContext, Dispatch, ReactNode, useEffect, useState } from 'react'

export const MainContext = createContext<any>({});

interface Props{
  children: ReactNode
}

export const MainProvider = (props: Props) => {

  const  railsUrl  = process.env.REACT_APP_RAILS_URL
  const { children } = props;

  const [data, setData] = useState([]);
  const [text, setText] = useState<string>();

  const [name, setName] = useState<string>()
  const [password, setPassword] = useState<string>()

  const configAxios = {withCredentials: true}

  const [ booksIndex, setBooksIndex ] = useState([])

  const [ loginFlag, setLoginFlag ] = useState<boolean>(false)

  const onClickTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  const [userId, setUserId] = useState()

  const [googleData, setGoogleData] = useState([]);

  interface TargetItem {
    title: string;
    author: string;
    imageUrl: string;
    itemUrl: string;
  }
  const [targetItem, setTargetItem] = useState<TargetItem>({title: "", author: "", imageUrl: "",itemUrl: ""})
  const [time, setTime] = useState<number>(new Date().getTime())
  const [targetFlag, setTargetFlag] = useState<boolean>(false)

  const onClickPostRails = () => {
    const trans: number = time / 1000
    axios.post(`${railsUrl}/books`,{
      booktitle: targetItem.title,
      author: targetItem.author,
      bookimage: targetItem.imageUrl,
      thoughts: idea,
      date: trans,
      user_id: userId
    },configAxios).then((res) => {
      setTargetFlag(() => false);
      setTargetItem(() => ({title: "", author: "", imageUrl: "",itemUrl: ""}))
      setIdea(() => (""))

    })
    .catch(error => {

    });

  }

  const [idea, setIdea] = useState<string>()



  const targetFlagChangeReset = ():void => {
    setTargetFlag(() => false);
    setTargetItem(() => ({title: "", author: "", imageUrl: "",itemUrl: ""}))
    setData(() => [])
    setGoogleData(() => [])
    setText(() => '')
    setIdea(() => (""))
  }

  return (
    <MainContext.Provider value={{ data, setData, text, setText,
    name, setName, password, setPassword, configAxios, booksIndex, setBooksIndex,loginFlag ,setLoginFlag ,railsUrl, onClickTop,
    userId, setUserId, googleData, setGoogleData, targetFlagChangeReset, targetItem, setTargetItem,onClickPostRails, setTime,idea, setIdea,targetFlag, setTargetFlag}}>
      { children }
    </MainContext.Provider>
  )
}
