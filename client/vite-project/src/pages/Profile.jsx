import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'


function Profile() {
  const { user } = useAuth() // logged in User
  const { username } = useParams() // logged in user , some other username

  const [userData, setUserData] = useState(null)

  const isOwnProfile = user.username === username

  console.log(isOwnProfile)



  console.log(username) // james123

  const fetchProfile = async () => {
    try {
      const user = await axiosInstance.get(`users/profile/${username}`)
      setUserData(user.data.profileData)
      console.log(user.data.profileData)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [username])



  const [activeTab, setActiveTab] = useState('posts')

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  const joinedDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Container with full desktop responsiveness */}
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Main Profile Header Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">

          {/* Banner Header */}
          <div className="h-48 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 sm:h-64" />

          {/* User Details & Actions Header */}
          <div className="px-6 pb-6 sm:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 mb-6 gap-4">

              {/* Avatar & Identifiers */}
              <div className="flex items-end space-x-5">
                <div className="flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-4xl sm:text-5xl font-black text-white shadow-lg shrink-0">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {userData.name}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-600">@{userData.username}</p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-3">

                {isOwnProfile ? <button className="flex-1 sm:flex-none rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95">
                  Edit Profile
                </button> : <button className="flex-1 sm:flex-none rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95">
                  Follow
                </button>}

                <button className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition-all hover:bg-slate-100 active:scale-95">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Profile Meta & Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">

              {/* Joined / Email Info */}
              <div className="md:col-span-1 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Details</p>
                <p className="text-sm text-slate-600 truncate">{userData.email}</p>
                <p className="text-xs text-slate-400">Member since {joinedDate}</p>
              </div>

              {/* Stats Center Grid */}
              <div className="md:col-span-2 flex justify-between sm:justify-end gap-8 text-center sm:text-right">
                <div>
                  <span className="block text-xl font-bold text-slate-900">{userData.posts?.length || 0}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Posts</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-slate-900">{userData.followers?.length || 0}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Followers</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-slate-900">{userData.followings?.length || 0}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Following</span>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex border-t border-slate-100 bg-slate-50/50 px-6">
            {[
              { id: 'posts', label: 'Posts', count: userData.posts?.length || 0 },
              { id: 'reels', label: 'Reels', count: userData.reels?.length || 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-all ${activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                {tab.label}
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Content Feeds Section */}
        <div className="mt-8">
          {user[activeTab]?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user[activeTab].map((item, idx) => (
                <div key={idx} className="aspect-square rounded-2xl bg-slate-200 border border-slate-100" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-bold mb-3">
                !
              </div>
              <h3 className="text-base font-bold text-slate-800">No {activeTab} yet</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                When {user.name} shares {activeTab}, they will show up here on their profile.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile