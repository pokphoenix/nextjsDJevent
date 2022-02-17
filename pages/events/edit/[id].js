import moment from 'moment'
import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { API_URL } from '@/config/index'
import styles from  '@/styles/Form.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image'
import {FaImage} from 'react-icons/fa'
import { parseCookies } from '@/helpers/index'

export default function EditEventPage({evt,token}) {
  const [values, setValues] = useState({
    name:evt.attributes.name,
    slug:evt.attributes.slug,
    performers: evt.attributes.performers,
    venue:evt.attributes.venue,
    address:evt.attributes.address,
    date:evt.attributes.date,
    time:evt.attributes.time,
    description: evt.attributes.description
  })

  const [imagePreview, setImagePreview] = useState( evt.attributes.image && evt.attributes.image.data ?  evt.attributes.image.data.attributes.formats.thumbnail.url : null)

  const [showModal, setShowModal] = useState(false)

  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault()

    //Validation 
    const hasEmptyFields = Object.values(values).some((element) => element ==='') 

    if(hasEmptyFields){
        toast.error('Please fill in all fields')
    }

    const data = {
      "data" : values
    }


   // const {token} = parseCookies(req)
    const res = await fetch(`${API_URL}/api/events/${evt.id}`,{
      method:'PUT',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    if(!res.ok){
      if(res.status === 403 || res.status === 401){
        toast.error('Unauthorized')
        return
      }
      toast.error('Something Went Wrong')
    }else{
      const evt = await res.json()
      router.push(`/events/${evt.data.attributes.slug}`)
    }

  }

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setValues({...values, [name]: value })
  }

  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/api/events/${evt.id}?populate=*`)
    const resData = await res.json()

    setImagePreview(resData.data.attributes.image.data.attributes.formats.thumbnail.url)
    setShowModal(false)
  }


  return (
        <Layout title='Edit Event'>
            <Link href='/events'>Go Back</Link>
            <h1>Edit Event</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                <div>
                    <label htmlFor='name'>Event Name</label>
                    <input
                    type='text'
                    id='name'
                    name='name'
                    value={values.name}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='slug'>Slug</label>
                    <input
                    type='text'
                    id='slug'
                    name='slug'
                    value={values.slug}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='performers'>Performers</label>
                    <input
                    type='text'
                    name='performers'
                    id='performers'
                    value={values.performers}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='venue'>Venue</label>
                    <input
                    type='text'
                    name='venue'
                    id='venue'
                    value={values.venue}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='address'>Address</label>
                    <input
                    type='text'
                    name='address'
                    id='address'
                    value={values.address}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='date'>Date</label>
                    <input
                    type='date'
                    name='date'
                    id='date'
                    value={moment(values.date).format('yyyy-MM-DD')}
                    onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='time'>Time</label>
                    <input
                    type='text'
                    name='time'
                    id='time'
                    value={values.time}
                    onChange={handleInputChange}
                    />
                </div>
                </div>

                <div>
                <label htmlFor='description'>Event Description</label>
                <textarea
                    type='text'
                    name='description'
                    id='description'
                    value={values.description}
                    onChange={handleInputChange}
                ></textarea>
                </div>

                <input type='submit' value='Update Event' className='btn' />
            </form>

            <h2>Event Image</h2>
            {imagePreview ? (
                <Image src={imagePreview} height={100} width={170} />
            ) : <div> <p>No image uploaded</p> </div> }

            <div>
                <button onClick={() => setShowModal(true)} className='btn-secondary'>
                    <FaImage /> Set Image
                </button>
            </div>

    
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <ImageUpload evtId={evt.id}  imageUploaded={imageUploaded} token={token} />
            </Modal>
        </Layout>
  )
}

export async function getServerSideProps({params: {id},req}){
  const {token} = parseCookies(req)
    const res = await fetch(`${API_URL}/api/events/${id}?populate=*`)
    const evt = await res.json()
    return {
        props: {
            evt: evt.data,
            token
        },
    }
}