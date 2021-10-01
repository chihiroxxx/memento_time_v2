import React, { VFC } from 'react';

export const Footer: VFC = () => {
  return(
    <>
<div className=" h-28">

<div className="w-full items-center fixed bottom-0 right-0">
            <footer className="text-blueGray-700 transition duration-500 ease-in-out transform  ">
              <div className="h-11 flex justify-between flex-col p-1 mx-auto md:items-center md:flex-row">
                <div className="fixed right-0 ">

                <a href="/" className="pr-2 lg:pr-8 lg:px-6 focus:outline-none">
                  <div className="inline-flex items-center">
                    <div className="block p-2 text-base tracking-tighter text-black transition duration-500 ease-in-out transform cursor-pointer hover:text-blueGray-500 lg:text-x lg:mr-8">
                       &copy; memento time. </div>
                  </div>
                </a>
                </div>
              </div>
            </footer>
          </div>
</div>

    </>
  )
}
