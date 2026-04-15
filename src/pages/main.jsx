import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import {MantineProvider, createTheme} from '@mantine/core';
import "@mantine/core/styles.css";
import '../css/index.css'
import App from './App.jsx'

const theme = createTheme({
    primaryColor: 'blue',
    defaultRadius: 'md',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <MantineProvider theme={theme} forceColorScheme="dark">
          <BrowserRouter>
              <App />
          </BrowserRouter>
      </MantineProvider>
  </StrictMode>,
)
