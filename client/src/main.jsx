import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router"

// Redux imports
import { Provider } from "react-redux"  // Provider poori app ko Redux ki taqat deta hai
import store from "./store"              // Humara central godown

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provider ke andar jo bhi component hai, wo Redux ka data use kar sakta hai */}
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
