import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../axiosCalls/axios'

function Profile() {
  const { user } = useAuth()
  const { username } = useParams()

  const [userData, setUserData] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
  })
  const [previewImage, setPreviewImage] = useState('')


  const isOwnProfile = user?.username === username

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(`users/profile/${username}`)
      const profileData = response.data.profileData

      setUserData(profileData)

      setIsFollowing(
        profileData.followers?.some(
          (followerId) => followerId.toString() === user?._id?.toString()
        ) ?? false
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [username, user?._id])

  const openEditProfile = () => {
    setEditForm({
      name: userData.name || '',
      username: userData.username || '',
      email: userData.email || '',
      bio: userData.bio || '',
    })

    setPreviewImage(userData.profileImage || '')
    setIsEditOpen(true)
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setPreviewImage(URL.createObjectURL(file))
  }

  const handleEditSubmit = (event) => {
    event.preventDefault()

    setUserData((current) => ({
      ...current,
      ...editForm,
      profileImage: previewImage,
    }))

    setIsEditOpen(false)
  }

  const handleFollowToggle = async () => {
    if (!userData || followLoading || isOwnProfile) {
      return
    }

    setFollowLoading(true)

    try {
      const endpoint = isFollowing
        ? `users/unfollow/${userData._id}`
        : `users/follow/${userData._id}`

      await axiosInstance.post(endpoint)

      setIsFollowing((current) => !current)

      setUserData((current) => {
        if (!current) return current

        const currentFollowers = current.followers || []
        const currentUserId = user._id.toString()

        const nextFollowers = isFollowing
          ? currentFollowers.filter(
              (followerId) => followerId.toString() !== currentUserId
            )
          : [...currentFollowers, user._id]

        return {
          ...current,
          followers: nextFollowers,
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      setFollowLoading(false)
    }
  }

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
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="h-48 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 sm:h-64" />

          <div className="px-6 pb-6 sm:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 mb-6 gap-4">
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

              <div className="flex items-center gap-3">
                {isOwnProfile ? (
                  <button
                    onClick={openEditProfile}
                    className="flex-1 sm:flex-none rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className="flex-1 sm:flex-none rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {followLoading ? 'Please wait...' : isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}

                <button className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition-all hover:bg-slate-100 active:scale-95">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-.326 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.724-3.35 0a1.724 1.724 0 00-2.573-1.066c-.94-1.543-.326-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
              <div className="md:col-span-1 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Details</p>
                <p className="text-sm text-slate-600 truncate">{userData.email}</p>
                <p className="text-xs text-slate-400">Member since {joinedDate}</p>
              </div>

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

          <div className="flex border-t border-slate-100 bg-slate-50/50 px-6">
            {[
              { id: 'posts', label: 'Posts', count: userData.posts?.length || 0 },
              { id: 'reels', label: 'Reels', count: userData.reels?.length || 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {userData[activeTab]?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userData[activeTab].map((item, idx) => (
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
                When {userData.name} shares {activeTab}, they will show up here on their profile.
              </p>
            </div>
          )}
        </div>
      </div>

      {isEditOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsEditOpen(false)
            }
          }}
        >
          <form
            onSubmit={handleEditSubmit}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update your profile details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="mb-6 flex flex-col items-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="h-28 w-28 rounded-full object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-600 text-4xl font-black text-white">
                  {editForm.name ? editForm.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              <label className="mt-3 cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Name</label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Username</label>
                <input
                  name="username"
                  value={editForm.username}
                  onChange={handleEditChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Bio</label>
                <textarea
                  rows="3"
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  placeholder="Tell people a little about yourself..."
                  className="mt-1 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Profile
