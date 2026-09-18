import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const {user} = useAuth()
  return (
    <div>
      <Link to={`/profile/${user.username}`}>Go to Profile</Link>
    </div>
  )
}

export default Home