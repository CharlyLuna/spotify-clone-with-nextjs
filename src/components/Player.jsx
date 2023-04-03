import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSpotify } from '@/hooks/useSpotify'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '@/atoms/songAtom'
import { useSongInfo } from '@/hooks/useSongInfo'
import { ArrowsRightLeftIcon, ArrowPathRoundedSquareIcon, SpeakerWaveIcon as VolumeDownIcon } from '@heroicons/react/24/outline'
import { ForwardIcon, BackwardIcon, PlayCircleIcon, PauseCircleIcon, SpeakerWaveIcon as VolumeUpIcon } from '@heroicons/react/24/solid'
import { debounce } from 'lodash'

export const Player = () => {
  const spotifyApi = useSpotify()
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const { data: session } = useSession()
  const [volume, setVolume] = useState(50)
  const [device, setDevice] = useState(null)
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

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then(({ body }) => {
      if (currentTrackId && device !== null) {
        if (body?.is_playing) {
          spotifyApi.pause()
          setIsPlaying(false)
        } else {
          spotifyApi.play()
          setIsPlaying(true)
        }
      }
    })
  }

  const debounceAdjustVolume = useCallback(debounce((volume) => {
    spotifyApi.setVolume(volume).catch(console.log)
  }, 400), [])

  useEffect(() => {
    // get current song at the begining when we dont have a currentTrackId setted
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      setVolume(50)
      fetchCurrentSong()
    }
  }, [currentTrackId, spotifyApi, session])

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume)
    }
  }, [volume])

  useEffect(() => {
    const getDevices = async () => {
      const { body } = await spotifyApi.getMyDevices()
      if (body.devices.length <= 0) {
        setDevice(null)
      } else {
        setDevice(body.devices[0].id)
      }
    }
    getDevices()
  }, [spotifyApi, currentTrackId])

  const handleSkipTrack = async () => {
    // if (device !== null && currentTrackId) {
    //   console.log('skipped')
    //   spotifyApi.skipToNext({
    //     device_id: device
    //   })
    //   setIsPlaying(true)
    // }
    console.log('skipped track')
  }

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900
    text-white grid grid-cols-3 text-xs md:text-base md:px-8'
    >
      {/* Left section */}
      <div className='flex items-center space-x-4'>
        <div>
          {
            currentTrackId && <img className='hidden md:inline h-16 w-16' src={songInfo?.album.images?.[0].url} alt='' />
          }
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
        <ForwardIcon
          onClick={handleSkipTrack} className='button'
        />
        <ArrowPathRoundedSquareIcon
          className='button'
        />
      </div>
      {/* Right section */}
      <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
        <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume - 10)} className='button' />
        <input
          className='w-14 md:w-28'
          type='range' value={volume}
          min={0}
          max={100}
          onChange={e => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 10)} className='button' />
      </div>
    </div>
  )
}
