import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Store Manager UI</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Data Layer Initialized. Ready for UI Components.</p>
      </div>
    </>
  )
}

export default App
