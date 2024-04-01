import {useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'


const Profile = () => {
  const fileRef = useRef(null)
  const {currentUser} = useSelector(state=>state.user)
  const [image, setImage] = useState(undefined)
  const [imagePercent, setImagePercent] = useState(0)
  const [imageError, setImageError] = useState(null)
  const [formData, setFormData] = useState({})

  console.log(formData)
  useEffect(()=>{
    if(image){
      handleFileUplaod(image)
    }
  }, [image])


  const handleFileUplaod = (image)=>{
    const storage = getStorage(app)
    const fileName = new Date().getTime()+image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setImagePercent(Math.round(progress))
      },
      (error)=>{
        setImageError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL)=>{
            setFormData({...formData, profilePicture:downloadURL});
          });
      }
    );
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" ref={fileRef} accept='img/*' hidden onChange={(e)=>setImage(e.target.files[0])}/>
        {
          // // Firebase Storage Rules 
          // service firebase.storage {
          //   match /b/{bucket}/o {
          //     match /{allPaths=**} {
          //       allow read;
          //       allow write:if
          //       request.resource.size < 2*1024*1024 && 
          //       request.resource.contentType.matches('image/.*')
          //     }
          //   }
          // }
        }
        <img src={formData.profilePicture || currentUser?.profilePicture} onClick={()=>fileRef.current.click()} alt="profile" className='h-24 w-24 mt-2 self-center cursor-pointer rounded-full object-cover'/>
        <p className='text-sm self-center'>
          {imageError?
          <span className='text-red-700'>Error Uploading Image (file size must be less tan 2MB)</span>
          :
          (imagePercent > 0 && imagePercent < 100) ? 
          (<span className='text-slate-700'>Uploading : {imagePercent}%</span>)
          :
          imagePercent === 100?(<span className='text-green-700'>Image Uploaded Successfully!</span>):''
          
        }
        
        </p>


        <input type="text" id="username" defaultValue={currentUser.username} placeholder='Username' className='bg-slate-100 rounded-lg p-3' />
        <input type="email" defaultValue={currentUser.email} id="email" placeholder='Email' className='bg-slate-100 rounded-lg p-3' />
        <input type="password" id="password" placeholder='Password' className='bg-slate-100 rounded-lg p-3' />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Signout</span>
      </div>
    </div>
  )
}

export default Profile