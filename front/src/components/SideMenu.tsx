import { Dispatch, SetStateAction } from "react"
import { Link } from "react-router-dom"

interface Props{
  setMenuFlag: Dispatch<SetStateAction<boolean>>,
  onClickLogOut: Dispatch<SetStateAction<void>>,
  loginFlag: boolean,

}
export const SideMenu = ({setMenuFlag, onClickLogOut, loginFlag}:Props) => {
  const onClickCloseMenu = () => {
    setMenuFlag(false)
  }
  const onClickLogOutCloseMenu = () => {
    onClickLogOut()
    onClickCloseMenu()
  }
  return(


<div className="relative bg-gray-900 h-72 dark:bg-gray-800 rounded-b-lg md:hidden">
    <div className="flex flex-col sm:flex-row sm:justify-around">
        <div className="w-60 h-screen">
            <nav className="mt-4 px-6">
              <Link to="/">
                <a onClick={onClickCloseMenu}
                className="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-100 dark:text-gray-400 rounded-lg ">
                <span className="flex-grow text-right pr-2">
                    HOME
                    </span>
                </a>
                    </Link>
                    <Link to="/login">
                <a onClick={onClickCloseMenu}
                className="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-100 dark:text-gray-400 rounded-lg ">
                    <span className="flex-grow text-right pr-2">
                    LOG IN
                    </span>
                </a>
                </Link>
                {loginFlag &&
                <>

                <a onClick={onClickLogOutCloseMenu}
                className="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-100 dark:text-gray-400 rounded-lg ">

                    <span className="flex-grow text-right pr-2">
                    LOG OUT

                    </span>
                </a>
                <Link to="/index">
                <a onClick={onClickCloseMenu}
                className="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-100 dark:text-gray-400 rounded-lg ">
                    <span className="flex-grow text-right pr-2">
                    INDEX
                    </span>
                </a>
                    </Link>
                </>
                }
            </nav>
        </div>
    </div>
</div>


  )
}
