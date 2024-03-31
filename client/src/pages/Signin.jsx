import { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../components/OAuth'

const Signin = () => {
  const [formData, setFormData] = useState({})
  // const [error, setError] = useState(null)
  // const [loading, setLoading] = useState(false)
  const {loading, error} = useSelector((state)=> state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const handleChange = (e)=>{
    setFormData({ ...formData, [e.target.id] : e.target.value})
  }
  // console.log(formData)

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      // setLoading(true)
      // setError(false)
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method : 'POST',
        headers : { 
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(formData)
      })
      const data = await res.json()
      // setLoading(false)
      if(data.success === false){
        // setError(true)
        // console.log(data)
        dispatch(signInFailure(data))
        // console.log(error)
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
      // console.log(data)
    } catch(error){
      // setLoading(false)
      // setError(true)
      // console.log(error)
      dispatch(signInFailure(error))
      // console.log(error)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" id="email" placeholder="Email" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" id="password" placeholder="Password" className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Sign in"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don&apos;t have an account?</p>
        <Link to='/sign-up'>
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>
      <p className='text-red-700 mt-5'>{error ? error.error || 'Something went wrong!' : ''}</p>
    </div>
  )
}

export default Signin