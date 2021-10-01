import React, { ChangeEvent, Dispatch, SetStateAction, useContext } from 'react'
import { MainContext } from '../providers/Provider';


interface Props{
  acitonTitle: string,
  actionComment: string,
  onClickAciton: any,
}

const LoginInputItem = (props: Props) => {
  const { acitonTitle ,actionComment,onClickAciton} = props
  const { setName,setPassword } = useContext(MainContext);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(() => e.target.value)
  }
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(() => e.target.value )
  }
  return (
    <>

                <h1 className="cursor-default my-12 font-black tracking-tighter text-black hover:text-indigo-900 text-5xl title-font">
                  {acitonTitle} .
                <div className="mt-3 ml-1 tracking-tighter text-gray-400  text-base font-medium">
                  {actionComment}</div>
                </h1>
                <div>
                  <label className="text-base font-medium leading-relaxed text-blueGray-700">User Name</label>
                  <input onChange={onChangeName}
                  type="name" placeholder="User Name "
                  className="border-2 border-gray-500 w-full px-4 py-2 mt-2 text-base text-indigo-900 border-transparent rounded-lg bg-blueGray-100 ext-blue-700 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"/>{/* autocomplete="" required=""*/}
                </div>
                <div className="mt-4">
                  <label className="text-base font-medium leading-relaxed text-blueGray-700">Password</label>
                  <input onChange={onChangePassword}
                   type="password" placeholder="Password"
                   className="border-2 border-gray-500 w-full px-4 py-2 mt-2 text-base text-indigo-900 border-transparent rounded-lg bg-blueGray-100 ext-blue-700 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2"/>{/* required="" minlength="6" */}
                </div>
                <div className="mt-2 text-right">
                </div>
                <button onClick={onClickAciton}
                type="submit"
                className="bg-yellow-400 block w-full px-4 py-3 mt-6 font-semibold text-white transition duration-500 ease-in-out transform rounded-lg  hover:bg-yellow-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 hover:to-black">
                  {acitonTitle}</button>
    </>
  )
}

export default LoginInputItem
