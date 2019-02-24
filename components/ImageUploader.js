import React, { Component } from 'react'
import Images from '../components/Images'
import { API_URL } from '../config'
import axios from 'axios'


const AddButton = (props) => {
  const imageStyle = {
    width: '168px',
    height: '168px',
    margin: '0 auto',
    border: 'solid 1px black'
  }

  return (
    <React.Fragment>
      <div className="placeholder" style={imageStyle} />
      <input type='file' id='single' style={{ display: 'none' }} placeholder='Add Photo' accept='image/*' onChange={props.onChange} />
      <label htmlFor='single'>Add Photo </label>
    </React.Fragment>
  )
}

export default class ImageUploader extends Component {
  state = {
    uploading: false,
    images: [],
    error: '',
  }

  onChange = e => {
    const files = Array.from(e.target.files)
    this.setState({ uploading: true })

    const formData = new FormData()
    const types = ['image/png', 'image/jpeg', 'image/gif']

    // Modify files here
    files.forEach((file, i) => {

      if (types.every(type => file.type !== type)) {
        this.setState({
          error: 'File must be a .png, .jpg or .gif'
        })
      } else if(file.size > 150000) {
        this.setState({
          error: 'File size must be under 150MB'
        })
      }

      formData.append(i, file)
    })

    if(this.state.error == '') {
      axios.post('/image-upload-single', formData)
      .then(res => {
        console.log('res.json', res)

        if (res.status != 200) {
          throw res
        }
        return res.data
      })
      .then(images => {
        this.setState({
          uploading: false,
          images,
          error: ''
        })
      })
      .catch(err => {
        console.log(err)
          this.setState({ uploading: false,
          error: 'Something went wrong, please try again' })
      })
    }
  }

  removeImage = id => {
    this.setState({
      images: this.state.images.filter(image => image.public_id !== id)
    })
  }

  render() {
    const { uploading, images, error } = this.state

    const content = () => {
      switch(true) {
        case uploading:
          return <div>Loading</div>
        case !!error:
          return (
            <React.Fragment>
              <AddButton onChange={this.onChange} />
              <p className="error-message">{this.state.error}</p>
            </React.Fragment>
          )
        case images.length > 0:
          return <Images images={images} removeImage={this.removeImage} />
        default:
          return <AddButton onChange={this.onChange} />
      }
    }

    return (
      <React.Fragment>
        <div className='image-uploader'>
          {content()}
        </div>
      </React.Fragment>
    )
  }
}
