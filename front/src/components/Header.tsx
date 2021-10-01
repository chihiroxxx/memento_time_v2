import React, { useContext, useState, VFC } from 'react';
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios';
import { MainContext } from '../providers/Provider';
import { SideMenu } from './SideMenu';

export const Header: VFC = () => {
  const { configAxios, loginFlag, setLoginFlag,railsUrl } = useContext(MainContext);

  const history = useHistory();

  const onClickLogOut = (): void => {
    axios.delete(`${railsUrl}/logout`,configAxios)
    .then((res) => {
      setLoginFlag(() => false)
      history.push("/")

    })
    .catch(error => {
    });

  }
    const [menuFlag, setMenuFlag] = useState<boolean>(false);

    const  onClickMenu = (): void => {
      setMenuFlag(!menuFlag)
    }

  return(
      <>
    <div className="container items-center -mb-1">
    <div className="text-ind-700 rounded-lg">
      <div className="w-screen flex justify-between md:justify-start  p-5 mx-auto md:items-center md:flex-row">
        <a href="/" className="pr-2 md:pr-8 md:px-6 focus:outline-none">
          <div className="inline-flex items-center">
            <div className="w-2 h-2 p-2 mr-2 rounded-full bg-gradient-to-tr bg-indigo-700 ">
            </div>
            <h2 className="block p-2 text-xl font-medium tracking-tighter text-black transition duration-500 ease-in-out transform cursor-pointer hover:text-indigo-900 md:text-x md:mr-8"> MEMENTO TIME </h2>
          </div>
        </a>

        <nav className="hidden md:block flex flex-wrap items-center justify-center text-base md:mr-auto">
          <ul className="items-center inline-flex list-none md:inline-flex">
            <li>
            <Link to="/">
              <div className="px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                HOME</div>
                </Link>
            </li>
            <li>
            <Link to="/login">
            <div className="px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                LOG IN</div>
                </Link>
            </li>
            { loginFlag &&
            <>
            <li>
              <div onClick={onClickLogOut} className="cursor-pointer px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                LOG OUT</div>
            </li>
            <li>
            <Link to="/index">
              <div className="px-4 py-1 mr-1 text-base text-blueGray-500 transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:text-white hover:bg-indigo-900 ">
                INDEX</div>
                </Link>
            </li>
            </>}
          </ul>
        </nav>

        <div onClick={onClickMenu}
        className="relative md:hidden pl-10 flex w-20 h-10 z-40">
              <button
              className="">
                <svg className="text-gray-900  w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>



        </div>
              {menuFlag &&
              <>
              <div className="absolute z-30 top-20 right-0">
              <SideMenu setMenuFlag={setMenuFlag} onClickLogOut={onClickLogOut} loginFlag={loginFlag}/>

              </div>
              </>
              }
      </div>
    </div>
  </div>
  <div className="bg-gray-900 h-5"></div>
</>

  )
}
