import SpotifyWebApi from 'spotify-web-api-node'

const scopes = [
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-modify-playback-state',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-recently-played',
  'user-read-playback-position',
  'user-top-read',
  'streaming',
  'user-follow-read',
  'user-library-read'
].join(',')

const params = {
  scope: scopes
}

const queryParamString = new URLSearchParams(params)

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET
})

export default spotifyApi
