import { getProviders, signIn } from 'next-auth/react'

const Login = ({ providers }) => {
  return (
    <div className='flex flex-col items-center bg-black min-h-screen
    w-full justify-center'
    >
      <img className='mb-5' src='https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green-768x231.png' alt='spotify' />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className='bg-[#18D860] text-white p-4 rounded-full'
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  )
}

export default Login

export const getServerSideProps = async (context) => {
  const providers = await getProviders()
  return {
    props: {
      providers
    }
  }
}
