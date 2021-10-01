import axios from 'axios'
import React, { ChangeEvent, useContext, useState, VFC } from 'react'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components'
import { MainContext } from '../providers/Provider';
import LoginInputItem from './LoginInputItem';

export const Lonin: VFC = () => {
  const { name, setName, password, setPassword, configAxios, loginFlag, setLoginFlag, railsUrl, userId, setUserId } = useContext(MainContext);


  const history = useHistory();

  const onClickLogIn = (): void => {
    axios.post(`${railsUrl}/login`,{
      name: name,
      password: password
    },configAxios).then((res) => {

      setUserId(res.data.user_id);
      history.push("/index")
      setName(() => (""))
      setPassword(() => (""))
      setLoginFlag(() => true)
    })
    .catch((error) => {
    });

  }

  const onClickSignUp = ():void => {
    axios.post(`${railsUrl}/users`,{
        name: name,
        password: password
      },configAxios).then((res) => {
        setUserId(res.data.user_id);
        history.push("/index")
        setName(() => (""))
        setPassword(() => (""))
        setLoginFlag(() => true)
      })
      .catch((error) => {
      });
  }


  const [signupFlag, setSignupFlag] = useState<boolean>(true)

  const onClickCangeSignupFlag = ():void => {
    setSignupFlag(!signupFlag)
  }

  return(
    <>
<section className="flex flex-col items-center h-screen md:flex-row ">
            <div className="relative hidden w-full h-screen bg-blueGray-400 lg:block md:w-1/3 xl:w-1/3">
              <img src="https://source.unsplash.com/random" alt="" className="absolute object-cover w-full h-full"/>
              <div className="relative z-10 m-12 text-left">
                <a className="flex items-center w-32 mb-4 font-medium text-blueGray-900 title-font md:mb-10">
                </a>
              </div>
            </div>

            <div className="flex w-full h-screen px-6 bg-whitelack md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 lg:px-16 xl:px-12 items-left justify-left">
              <div className="mt-6">

  {signupFlag ?

          <>

            <LoginInputItem acitonTitle="Log In" onClickAciton={onClickLogIn} actionComment="Welcome Back to MEMENTO TIME!" />

            <div onClick={onClickCangeSignupFlag}
              className="text-indigo-600 cursor-pointer mt-3">{signupFlag  && "Sign Up?" }</div>


            </>
  :
<>
  <LoginInputItem acitonTitle="Sign Up" onClickAciton={onClickSignUp} actionComment="Welcome to MEMENTO TIME!" />


  <div onClick={onClickCangeSignupFlag}
              className="text-indigo-600 cursor-pointer mt-3">{!signupFlag  && "Log In?" }</div>
            </>
}
              </div>
            </div>

</section>

    </>
  )
}
