import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <Link to='/profile/:username'>Go to Profile</Link>
    </div>
  )
}

export default Home