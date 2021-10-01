import logo from './logo.svg';
import React, { useContext } from 'react'

import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'
import './App.css';
import styled from 'styled-components';

import { Header } from './components/Header';

import { MainProvider, MainContext } from './providers/Provider';

import { Router } from './router/Router';

function App() {
  return (
    <div >

    <MainProvider>
    <BrowserRouter>
      <Header />
      <Router />
    </BrowserRouter>
    </MainProvider>

    </div>
  );
}

export default App;
