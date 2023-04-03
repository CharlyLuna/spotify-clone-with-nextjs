import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  HomeIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  RssIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline'
import { useSpotify } from '@/hooks/useSpotify'
import { useRecoilState } from 'recoil'
import { playlistIdState } from '@/atoms/playlistAtom'

export const Sidebar = () => {
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState([])
  const [, setPlaylistId] = useRecoilState(playlistIdState)
  const spotifyApi = useSpotify()

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then(({ body }) => {
        setPlaylists(body.items)
      }, (e) => {
        console.log(e)
      })
    }
  }, [session, spotifyApi])

  return (
    <div className='text-gray-500 p-5 text-xs lg:text-sm border-r
    border-gray-900 overflow-y-scroll h-screen scrollbar-hide
    sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36'
    >
      <div className='space-y-4'>
        <button className='flex items-center space-x-2
        hover:text-white'
        >
          <HomeIcon className='h-5 w-5' />
          <p>Home</p>
        </button>
        <button className='flex items-center space-x-2
        hover:text-white'
        >
          <MagnifyingGlassIcon className='h-5 w-5' />
          <p>Search</p>
        </button>
        <button className='flex items-center space-x-2
        hover:text-white'
        >
          <BuildingLibraryIcon className='h-5 w-5' />
          <p>Your library</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-900' />

        <button className='flex items-center space-x-2
        hover:text-white'
        >
          <PlusCircleIcon className='h-5 w-5' />
          <p>Create playlist</p>
        </button>
        <button className='flex items-center space-x-2
        hover:text-white'
        >
          <HeartIcon className='h-5 w-5' />
          <p>Liked songs</p>
        </button>
        <button className='flex items-center space-x-2
        hover:text-white'
        >
          <RssIcon className='h-5 w-5' />
          <p>Your episodes</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-900' />

        {/* PLaylists */}
        {
          playlists.map((playlist) => (
            <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className='cursor-pointer hover:text-white'>{playlist.name}</p>
          ))
        }
      </div>
    </div>
  )
}
