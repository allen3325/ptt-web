import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MarkdownBlock from './components/markdownBlock.jsx'
import Title from "./components/title.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Title />
      <MarkdownBlock />
    </div>
  )
}

export default App
