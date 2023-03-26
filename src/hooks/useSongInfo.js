import { currentTrackIdState } from '@/atoms/songAtom'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useSpotify } from './useSpotify'

export const useSongInfo = () => {
  const spotifyApi = useSpotify()
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [songInfo, setSongInfo] = useState(null)

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await spotifyApi.getTrack(currentTrackId)
        setSongInfo(trackInfo.body)
      }
    }
    // if (isPlaying) {
    //   const getCurrentPlayingTrack = async () => {
    //     const currentPlayingTrack = await spotifyApi.getMyCurrentPlaybackState()
    //     console.log('Cancion sonando >>', currentPlayingTrack)
    //   }
    //   getCurrentPlayingTrack()
    // }
    fetchSongInfo()
  }, [currentTrackId, spotifyApi])

  return songInfo
}
