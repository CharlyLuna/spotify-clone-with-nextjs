import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSpotify } from '@/hooks/useSpotify'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '@/atoms/songAtom'
import { useSongInfo } from '@/hooks/useSongInfo'
import { ArrowsRightLeftIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import { ForwardIcon, BackwardIcon, PlayCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid'

export const Player = () => {
  const spotifyApi = useSpotify()
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const { data: session, status } = useSession()
  const [volume, setVolume] = useState(50)
  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(
        ({ body }) => setCurrentTrackId(body?.item?.id)
      )
      spotifyApi.getMyCurrentPlaybackState().then(
        ({ body }) => setIsPlaying(body?.is_playing)
      )
    }
  }

  useEffect(() => {
    // get current song at the begining when we dont have a currentTrackId setted
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then(({ body }) => {
      if (body.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    })
  }

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900
    text-white grid grid-cols-3 text-xs md:text-base md:px-8'
    >
      {/* Left section */}
      <div className='flex items-center space-x-4'>
        <div className=''>
          <img className='hidden md:inline h-16 w-16' src={songInfo?.album.images?.[0].url} alt='' />
        </div>
        <div>
          <h3 className='w-28 md:w-40 truncate'>{songInfo?.name}</h3>
          <p className='w-28 md:w-40 truncate'>{songInfo?.artists?.[0].name}</p>
        </div>
      </div>
      {/* Center section */}
      <div className='flex items-center justify-evenly'>
        <ArrowsRightLeftIcon className='button' />
        <BackwardIcon className='button' />
        {
          isPlaying
            ? <PauseCircleIcon onClick={handlePlayPause} className='button h-10 w-10' />
            : <PlayCircleIcon onClick={handlePlayPause} className='button h-10 w-10' />
        }
        <ForwardIcon className='button' />
        <ArrowPathRoundedSquareIcon className='button' />
      </div>
    </div>
  )
}
