import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useSpotify } from '@/hooks/useSpotify'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '@/atoms/songAtom'
import { useSongInfo } from '@/hooks/useSongInfo'

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

  console.log(songInfo)

  return (
    <div>
      <div>
        <img className='hidden md:inline h-20 w-20' src={songInfo?.album.images?.[0].url} alt='' />
      </div>
    </div>
  )
}
