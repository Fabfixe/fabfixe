import React, { Component } from 'react'
import Images from '../components/Images'
import { API_URL } from '../config'
import axios from 'axios'

const AddButton = (props) => {

  return (
    <React.Fragment>
      <input type='file' id='single' placeholder='Add Photo' accept='image/*' onChange={props.onChange} />
    </React.Fragment>
  )
}

class AttachmentImageUploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploading: false,
      images: [],
      error: '',
    }

    this.removeImage = this.removeImage.bind(this)
  }

  // componentDidUpdate(prevProps) {
  //   if() {
  //     this.setState({ images: [ nextProps.images ] })
  //   }
  // }

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
      axios.post('/api/image-upload-single', formData, {headers: { 'content-type': 'multipart/form-data' }})
      .then(res => {

        if (res.status != 200) {
          throw res
        }

        return res.data
      })
      .then(images => {
        images = images.map(({url, public_id}) => ({ url, public_id }))
        this.setState({
          uploading: false,
          images,
          error: ''
        })
        this.props.onUpload(images[0])
      })
      .catch(err => {
        console.log(err)
          this.setState({ uploading: false,
          error: 'Something went wrong, please try again' })
      })
    }
  }

  removeImage() {
    this.setState({ images: []})
  }

  render() {
    const { uploading, error } = this.state
    const { images } = this.state

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
        case images[0] !== '' && images.length > 0:
          return <Images images={images} removeImage={this.removeImage} />
        default:
          return <AddButton onChange={this.onChange} />
      }
    }

    return (
      <React.Fragment>
        {content()}
      </React.Fragment>
    )
  }
}

export default AttachmentImageUploader
