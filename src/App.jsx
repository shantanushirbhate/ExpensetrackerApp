// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Header from "./Component/Headercomponent/Header"
import { SnackbarProvider } from 'notistack';


function App() {
  return (
    <SnackbarProvider>
      <Header />
      </SnackbarProvider>
  );
}

export default App;
