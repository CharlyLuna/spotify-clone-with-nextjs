import {
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { COLORS } from '@/utils/constants'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'

export const Center = () => {
  const { data: session } = useSession()
  const [color, setColor] = useState(null)

  useEffect(() => {
    setColor(shuffle(COLORS).pop())
  }, [])

  return (
    <div className='flex-grow text-white'>
      <header className='absolute top-5 right-8'>
        <div className='flex items-center bg-black space-x-3
        opacity-90 hover:opacity-80 cursor-pointer rounded-full
        p-1 pr-2'
        >
          <img className='rounded-full w-10 h-10' src={session?.user.image} alt='user image' />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className='h6 w-6' />
        </div>
      </header>
      <section className={`flex items-end space-x-7 
      bg-gradient-to-b to-black ${color} h-80`}
      >
        <h1>hey</h1>
        {/* <img src="" alt="" /> */}
      </section>
    </div>
  )
}
