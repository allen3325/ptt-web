import { useState } from 'react'
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
