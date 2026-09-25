import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AtSign, Camera, Check, Grid2x2, Link2, LogOut, Mail, PenLine, UserRound, Video, X } from 'lucide-react'
import { axiosInstance } from '../axiosCalls/axios'
import Avatar from '../components/ui/Avatar'
import BottomNav from '../components/ui/BottomNav'
import Field from '../components/ui/Field'
import PageLoader from '../components/ui/PageLoader'
import { profileCover } from '../data/demo'

const compact = new Intl.NumberFormat('en', { notation: 'compact' })

const softButton =
  'flex h-12 items-center justify-center gap-2 rounded-full bg-soft px-4 text-[15px] font-semibold text-ink transition hover:bg-line disabled:cursor-not-allowed disabled:opacity-60'
const inkButton =
  'flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-4 text-[15px] font-semibold text-white transition hover:bg-ink-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'

function Profile() {
  const { user, setUser } = useAuth() // Assuming setUser is available to update auth state
  const { username } = useParams()
  const navigate = useNavigate()

  const [userData, setUserData] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
  })
  const [previewImage, setPreviewImage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

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

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage])

  // Close the edit sheet with Escape (unless a save is in flight)
  useEffect(() => {
    if (!isEditOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSaving) setIsEditOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditOpen, isSaving])

  const openEditProfile = () => {
    setEditForm({
      name: userData.name || '',
      username: userData.username || '',
      email: userData.email || '',
      bio: userData.bio || '',
    })

    setPreviewImage(userData.profileImage || '')
    setSelectedFile(null)
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
    const file = event.target.files[0]

    if (!file) return

    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage)
    }

    setSelectedFile(file)
    const imageUrl = URL.createObjectURL(file)
    setPreviewImage(imageUrl)
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.append('name', editForm.name)
      formData.append('username', editForm.username)
      formData.append('email', editForm.email)
      formData.append('bio', editForm.bio)

      // Append file if a new one was selected
      if (selectedFile) {
        formData.append('profileImage', selectedFile)
      }

      const response = await axiosInstance.post('users/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const updatedUser = response.data.user || response.data.updatedUser || response.data

      // Update local page state
      setUserData((prev) => ({
        ...prev,
        ...updatedUser,
      }))

      // Update auth context state if helper exists
      if (setUser) {
        setUser((prev) => ({
          ...prev,
          ...updatedUser,
        }))
      }

      setIsEditOpen(false)

      // Redirect if username changed to match new route param
      if (editForm.username !== username) {
        navigate(`/profile/${editForm.username}`)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleFollowToggle = async () => {
    if (!userData || followLoading || isOwnProfile) return

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

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      console.log(error)
    }
  }

  if (!userData) {
    return <PageLoader />
  }

  const joinedDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const stats = [
    { label: 'Followers', value: userData.followers?.length || 0 },
    { label: 'Following', value: userData.followings?.length || 0 },
    { label: 'Posts', value: userData.posts?.length || 0 },
  ]

  const tabs = [
    { id: 'posts', label: 'Posts', icon: Grid2x2, count: userData.posts?.length || 0 },
    { id: 'reels', label: 'Reels', icon: Video, count: userData.reels?.length || 0 },
  ]

  const items = userData[activeTab] || []

  return (
    <div className="min-h-dvh bg-canvas pb-36">
      <div className="mx-auto max-w-3xl">
        {/* Cover */}
        <div className="relative h-52 overflow-hidden rounded-b-[36px] bg-ink sm:mx-4 sm:mt-4 sm:h-64 sm:rounded-[36px]">
          <img src={profileCover} alt="" className="h-full w-full object-cover opacity-80 grayscale" />
          <div className="absolute inset-x-4 top-4 flex justify-between">
            <button type="button" onClick={() => navigate('/home')} aria-label="Back to feed" className="glass-dark flex h-11 w-11 items-center justify-center rounded-full text-white">
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            {isOwnProfile && (
              <button type="button" disabled title="Logout is not available yet" aria-label="Logout (not available yet)" className="glass-dark flex h-11 w-11 items-center justify-center rounded-full text-white/60">
                <LogOut size={18} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Identity */}
        <section className="px-5 text-center">
          <div className="relative mx-auto -mt-16 w-fit">
            <Avatar
              src={userData.profileImage}
              name={userData.name}
              size="h-32 w-32 text-4xl"
              className="border-[5px] border-canvas shadow-lg"
            />
            {isOwnProfile && (
              <button type="button" onClick={openEditProfile} aria-label="Change profile photo" className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-canvas bg-ink text-white">
                <Camera size={15} aria-hidden="true" />
              </button>
            )}
          </div>

          <h1 className="mt-3 text-[28px] font-semibold leading-tight tracking-tight">{userData.name}</h1>
          <p className="text-[15px] font-semibold text-ochre-deep">@{userData.username}</p>
          {userData.bio ? (
            <p className="mx-auto mt-2 max-w-sm text-[15px] font-medium leading-relaxed text-muted">{userData.bio}</p>
          ) : (
            isOwnProfile && <p className="mx-auto mt-2 max-w-sm text-[15px] font-medium text-muted">Add a bio so people know what you&apos;re about.</p>
          )}
          <p className="mt-1 text-xs font-medium text-muted">Joined {joinedDate}</p>

          <dl className="mx-auto mt-6 grid max-w-md grid-cols-3 divide-x divide-line">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-sm font-medium text-muted">{stat.label}</dt>
                <dd className="text-xl font-semibold tabular-nums">{compact.format(stat.value)}</dd>
              </div>
            ))}
          </dl>

          <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-2">
            {isOwnProfile ? (
              <button type="button" onClick={openEditProfile} className={`${inkButton} col-span-2`}>
                <PenLine size={17} aria-hidden="true" />
                Edit profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  aria-pressed={isFollowing}
                  className={isFollowing ? softButton : inkButton}
                >
                  {followLoading ? 'Wait...' : isFollowing ? 'Following' : 'Follow'}
                </button>
                <button type="button" disabled title="Messaging is coming soon" className={softButton}>
                  Message
                </button>
              </>
            )}
            <button type="button" onClick={handleShareProfile} className={softButton} aria-live="polite">
              {linkCopied ? <Check size={17} aria-hidden="true" /> : <Link2 size={17} aria-hidden="true" />}
              {linkCopied ? 'Copied' : 'Share'}
            </button>
          </div>
        </section>

        {/* Tabs */}
        <div role="tablist" aria-label="Profile content" className="mx-auto mt-8 flex max-w-md border-b border-line px-5">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`-mb-px flex h-12 flex-1 items-center justify-center gap-2 border-b-2 text-sm font-semibold transition ${
                activeTab === id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
              <span className="tabular-nums text-muted">{count}</span>
            </button>
          ))}
        </div>

        {/* Media */}
        <section role="tabpanel" className="mt-4 px-4">
          {items.length > 0 ? (
            <div className="columns-2 gap-3 sm:columns-3">
              {items.map((item, idx) => {
                const src = item?.image || item?.mediaUrl || item?.url
                const shape = idx % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'

                return src ? (
                  <img key={idx} src={src} alt="" loading="lazy" className={`${shape} mb-3 w-full break-inside-avoid rounded-3xl bg-ochre-light object-cover`} />
                ) : (
                  <div key={idx} className={`${shape} mb-3 break-inside-avoid rounded-3xl bg-gradient-to-br from-ochre-light to-ochre`} />
                )
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-[28px] bg-surface p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-soft text-ochre-deep">
                {activeTab === 'posts' ? <Grid2x2 size={22} aria-hidden="true" /> : <Video size={22} aria-hidden="true" />}
              </div>
              <h2 className="mt-4 text-lg font-semibold">No {activeTab} yet</h2>
              <p className="mt-1 text-sm font-medium text-muted">
                {isOwnProfile
                  ? `Share your first ${activeTab === 'posts' ? 'post' : 'reel'} from the home feed.`
                  : `When ${userData.name} shares ${activeTab}, they will show up here.`}
              </p>
              {isOwnProfile && (
                <Link to="/home" className={`${inkButton} mx-auto mt-5 w-fit px-6`}>
                  Go to feed
                </Link>
              )}
            </div>
          )}
        </section>
      </div>

      <BottomNav active={isOwnProfile ? 'profile' : undefined} />

      {isEditOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSaving) {
              setIsEditOpen(false)
            }
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onSubmit={handleEditSubmit}
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[36px] bg-surface px-6 pb-8 pt-3 shadow-2xl sm:max-w-lg sm:rounded-[36px] sm:p-8"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line sm:hidden" aria-hidden="true" />

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 id="edit-profile-title" className="text-2xl font-semibold tracking-tight">Edit profile</h2>
                <p className="mt-0.5 text-sm font-medium text-muted">Update your profile details</p>
              </div>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => setIsEditOpen(false)}
                aria-label="Close"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-soft text-ink-soft transition hover:bg-line disabled:opacity-50"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="mb-6 flex flex-col items-center">
              <Avatar src={previewImage} name={editForm.name} size="h-28 w-28 text-4xl" className="shadow-lg" />

              <label className="mt-3 flex h-10 cursor-pointer items-center gap-2 rounded-full bg-soft px-4 text-sm font-semibold transition hover:bg-line">
                <Camera size={16} aria-hidden="true" />
                Change photo
                <input
                  type="file"
                  accept="image/*"
                  disabled={isSaving}
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="space-y-4">
              <Field id="edit-name" label="Name" icon={UserRound} name="name" value={editForm.name} onChange={handleEditChange} disabled={isSaving} />
              <Field id="edit-username" label="Username" icon={AtSign} name="username" value={editForm.username} onChange={handleEditChange} disabled={isSaving} />
              <Field id="edit-email" label="Email" icon={Mail} type="email" name="email" value={editForm.email} onChange={handleEditChange} disabled={isSaving} />
              <Field
                id="edit-bio"
                label="Bio"
                textarea
                rows="3"
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
                disabled={isSaving}
                placeholder="Tell people a little about yourself..."
              />
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button type="button" disabled={isSaving} onClick={() => setIsEditOpen(false)} className={softButton}>
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className={inkButton}>
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Profile
