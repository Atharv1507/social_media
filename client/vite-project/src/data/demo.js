// Static preview content until the posts, reels and stories APIs exist.
const photo = (id, width = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=75&auto=format&fit=crop`

export const stories = [
  { name: 'Irma', image: photo('1531746020798-e6953c6e8e04', 200), live: true },
  { name: 'Amanda', image: photo('1494790108377-be9c29b29330', 200) },
  { name: 'Luiz', image: photo('1507003211169-0a1dd7228f2d', 200) },
  { name: 'Nina', image: photo('1438761681033-6461ffad8d80', 200) },
  { name: 'Rohan', image: photo('1500648767791-00dcc994a43e', 200) },
  { name: 'Izaa', image: photo('1544005313-94ddf0286df2', 200) },
  { name: 'Meera', image: photo('1488426862026-3ee34a7d66df', 200) },
]

export const posts = [
  {
    id: 'p1',
    author: 'Alana Maesya',
    handle: 'naisyaatxt',
    avatar: photo('1534528741775-53994a69daeb', 160),
    image: photo('1470252649378-9c29740c9fa8'),
    caption: 'Love your mine',
    tags: ['lovetoyou', 'foryourpage', 'goldenhour'],
    likes: 1245,
    comments: 173,
    shares: 229,
    time: '2h',
  },
  {
    id: 'p2',
    author: 'Luiz Andrade',
    handle: 'luiz.frames',
    avatar: photo('1507003211169-0a1dd7228f2d', 160),
    image: photo('1501785888041-af3ef285b470'),
    caption: 'Chased the sunrise up here. Worth every step.',
    tags: ['mountains', 'weekend'],
    likes: 3480,
    comments: 96,
    shares: 41,
    time: '5h',
  },
  {
    id: 'p3',
    author: 'Nina Park',
    handle: 'ninapark',
    avatar: photo('1438761681033-6461ffad8d80', 160),
    image: photo('1515886657613-9f3515b0c78f'),
    caption: 'New season, same energy',
    tags: ['style', 'ootd'],
    likes: 892,
    comments: 58,
    shares: 12,
    time: '1d',
  },
]

export const suggestions = [
  { name: 'Priya Nair', handle: 'priyanair', avatar: photo('1517841905240-472988babdf9', 160) },
  { name: 'Arjun Kapoor', handle: 'arjunk', avatar: photo('1500648767791-00dcc994a43e', 160) },
  { name: 'Meera Das', handle: 'meerad', avatar: photo('1488426862026-3ee34a7d66df', 160) },
]

export const landingPortrait = photo('1513097633097-329a3a64e0d4', 900)
export const profileCover = photo('1464822759023-fed622ff2c3b', 1600)
