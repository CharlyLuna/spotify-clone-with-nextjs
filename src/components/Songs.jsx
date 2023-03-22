import { Song } from './Song'

export const Songs = ({ tracks }) => {
  return (
    <div className='px-8 flex flex-col space-y-1 pb-28 text-white'>
      {
        tracks?.map(({ track }, i) => (
          <Song key={track.id} track={track} order={i} />
        ))
      }
    </div>
  )
}
