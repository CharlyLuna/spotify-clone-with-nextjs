import { currentTrackIdState, isPlayingState } from '@/atoms/songAtom'
import { useSpotify } from '@/hooks/useSpotify'
import { millisToMinutesAndSeconds } from '@/lib/time'
import { useRecoilState } from 'recoil'

export const Song = ({ track, order }) => {
  const spotifyApi = useSpotify()
  const [, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [, setIsPlaying] = useRecoilState(isPlayingState)
  // const playlist = useRecoilValue(playlistState)

  const playSong = async () => {
    // Spotify api doesnt work without oficial spotify app open
    const { body } = await spotifyApi.getMyDevices()
    if (body.devices.length <= 0) {
      console.log('ERROR: NO DEVICES FOUND')
      return
    }
    setCurrentTrackId(track.id)
    setIsPlaying(true)
    spotifyApi.play({
      uris: [track.uri],
      // context_uri: playlist.uri,
      // offset: { position: order },
      device_id: body.devices[0].id
    })
  }

  return (
    <div
      className='grid grid-cols-2 text-gray-500 py-2
    px-5 hover:bg-gray-900 rounded-md cursor-pointer'
      onClick={playSong}
    >
      <div className='flex items-center space-x-4'>
        <p>{order + 1}</p>
        <img className='h-10 w-10' src={track.album.images?.[0].url} />
        <div>
          <p className='w-36 lg:w-64 truncate text-white'>{track.name}</p>
          <p className='w-36 lg:w-64 truncate'>{track.artists[0].name}</p>
        </div>
      </div>
      <div className='flex items-center justify-between ml-auto
      md:ml-0'
      >
        <p className='w-40 truncate hidden md:inline'>
          {track.album.name}
        </p>
        <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
      </div>
    </div>
  )
}
