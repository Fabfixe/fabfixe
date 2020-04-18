import React, { Component } from 'react'
import Images from '../components/Images'
import { API_URL } from '../config'
import { connect } from 'react-redux'
import axios from 'axios'
const classnames = require('classnames')

const AddButton = (props) => {
  const imageStyle = {
    width: '168px',
    height: '168px',
    margin: '0 auto',
    borderRadius: '50%'
  }

  return (
    <React.Fragment>
      <div className="placeholder" style={imageStyle} />
      <input type='file' id='single' style={{ display: 'none' }} placeholder='Add Photo' accept='image/*' onChange={props.onChange} />
      <label htmlFor='single'>Add Photo </label>
    </React.Fragment>
  )
}

class ImageUploader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      uploading: false,
      images: [ this.props.images ],
      error: '',
    }

    this.removeImage = this.removeImage.bind(this)
  }

  componentDidUpdate(prevProps) {
    if(prevProps.images.length === 0 && this.props.images.length > 0) {
      this.setState({ images: [ this.props.images ] })
    }
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

        if (res.status != 200) {
          throw res
        }

        return res.data
      })
      .then(images => {
        images = images.map(image => image.url)
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

    const hasImages = this.state.images[0] && this.state.images[0].length > 0

    return (
      <React.Fragment>
        <div style={{ marginTop: "50px" }}
          className={classnames('image-uploader', { 'noLabel': hasImages })}>
          {content()}
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  images: state.profile.profileImageUrl,
})

export default connect(mapStateToProps)(ImageUploader)
