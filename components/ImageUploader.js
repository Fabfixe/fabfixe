import React, { Component } from 'react'
import Images from '../components/Images'
import { API_URL } from '../config'
import fetch from 'isomorphic-unfetch'
import '../scss/imageloader.scss'

const AddButton = (props) => {
  return (
    <div>
      <input type='file' id='single' placeholder='Add Photo' onChange={props.onChange} />
    </div>
  )
}
export default class ImageUploader extends Component {
  state = {
    uploading: false,
    images: []
  }

  onChange = e => {
    const files = Array.from(e.target.files)
    this.setState({ uploading: true })

    const formData = new FormData()

    files.forEach((file, i) => {
      formData.append(i, file)
    })

    fetch(`${API_URL}/image-upload-single`, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(images => {
      this.setState({
        uploading: false,
        images
      })
    })
  }

  removeImage = id => {
    this.setState({
      images: this.state.images.filter(image => image.public_id !== id)
    })
  }

  render() {
    const { uploading, images } = this.state

    const content = () => {
      switch(true) {
        case uploading:
          return <div>Loading</div>
        case images.length > 0:
          return <Images images={images} removeImage={this.removeImage} />
        default:
          return <AddButton onChange={this.onChange} />
      }
    }

    return (
      <div>
        <div className='image-uploader'>
          {content()}
        </div>
      </div>
    )
  }
}
