import React, { useContext, useEffect } from 'react'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import styled from 'styled-components';

import { Footer } from '../components/Footer';
import { Search } from '../components/Search';
import { Lonin } from '../components/Login';
import { Index } from '../components/Index';
import { MainContext } from '../providers/Provider';
import axios from 'axios';

export const Router = () => {
    const { configAxios,loginFlag, setLoginFlag, railsUrl, setUserId } = useContext(MainContext);

  useEffect(() => {
    axios.get(`${railsUrl}/`,configAxios).then((res) => {
      setUserId(res.data.user_id);
      setLoginFlag(() => true)
  })
  .catch(error => {
    setLoginFlag(() => false)
    });
  },[loginFlag])

  return(
    <Switch>
        <Route exact path="/">

          <SContainer>
          <Search />
          </SContainer>
        </Route>
        <Route path="/login">
          <Lonin />
        </Route>
        <Route path="/index">
          <Index />
          <Footer />
        </Route>
      </Switch>
  )
}


const SContainer = styled.div`
  min-height: 100vh;
`
