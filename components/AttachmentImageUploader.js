import React, { useState } from 'react'
import Images from '../components/Images'
import { API_URL } from '../config'
import axios from 'axios'

const AddButton = ({onChange}) => {

  return (
    <React.Fragment>
      <input type='file' id='single' placeholder='Add Photo' accept='image/*' onChange={onChange} />
    </React.Fragment>
  )
}

const AttachmentImageUploader = ({ onUpload }) => {
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)

  const removeImage = () => {
    setImages([])
  }
  const onChange = e => {
    const files = Array.from(e.target.files)
    setUploading(true)

    const formData = new FormData()
    const types = ['image/png', 'image/jpeg', 'image/gif']

    // Modify files here
    files.forEach((file, i) => {
      console.log(file.size)
      if (types.every(type => file.type !== type)) {
          setError('File must be a .png, .jpg or .gif')
      } else if(file.size > 150000) {
        setError('File size must be under 150MB')
      }

      formData.append(i, file)
    })

    if(error === '') {
      axios.post('/api/image-upload-single', formData, { headers: { 'content-type': 'multipart/form-data' }})
      .then(res => {

        if (res.status != 200) {
          throw res
        }

        return res.data
      })
      .then(images => {
        console.log(images)
        images = images.map(({url, public_id}) => ({ url, public_id }))
        setUploading(false)
        setImages(images)
        onUpload(images[0])
        // localStorage.setItem('imageUploads')
      })
      .catch(err => {
        console.log(err)
        setUploading(false)
        setError('Something went wrong, please try again')
      })
    }
  }

  switch(true) {
    case uploading:
      return <div>Uploading</div>
    case !!error:
      return (
        <React.Fragment>
          <AddButton onChange={(e) => onChange} />
          <p className="error-message">{error}</p>
        </React.Fragment>
      )
      case images[0] !== '' && images.length > 0:
        return <Images images={images} removeImage={removeImage} />

      default:
        return <AddButton onChange={onChange} />
  }
}

export default AttachmentImageUploader
