import {
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import { COLORS } from '@/utils/constants'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistState, playlistIdState } from '@/atoms/playlistAtom'
import { useSpotify } from '@/hooks/useSpotify'
import { Songs } from './Songs'

export const Center = () => {
  const { data: session } = useSession()
  const spotifyApi = useSpotify()
  const [color, setColor] = useState(null)
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  useEffect(() => {
    setColor(shuffle(COLORS).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then(({ body }) => {
      setPlaylist(body)
    }, (e) => {
      console.log(e)
    })
  }, [playlistId, spotifyApi])

  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide text-white'>
      <header className='absolute top-5 right-8'>
        <div
          className='flex items-center bg-black space-x-3
        opacity-90 hover:opacity-80 cursor-pointer rounded-full
        p-1 pr-2'
          onClick={() => signOut()}
        >
          <img className='rounded-full w-10 h-10' src={session?.user.image} alt='user image' />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className='h6 w-6' />
        </div>
      </header>
      <section className={`flex items-end space-x-7 
      bg-gradient-to-b to-black ${color} h-80 p-8`}
      >
        <img className='h-44 w-44 shadow-2xl' src={playlist?.images?.[0].url} alt='' />
        <div>
          <p>PLAYLIST</p>
          <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
        </div>
      </section>
      {/* Songs */}
      <div>
        <Songs tracks={playlist?.tracks.items} />
      </div>
    </div>
  )
}
