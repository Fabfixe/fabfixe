import React, { Component } from 'react'
import Images from '../components/Images'
import { API_URL } from '../config'
import axios from 'axios'
import { connect } from 'react-redux'
import { profileImageUpload, profileImageDelete } from '../actions/profileUpload'


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

class ImageUploader extends Component {
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

        if (res.status != 200) {
          throw res
        }

        return res.data
      })
      .then(images => {
        this.props.profileImageUpload(images)

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
    this.props.profileImageDelete(id)
  }

  render() {
    const { uploading, error } = this.state
    const { images } = this.props

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
        case images.profileImage.length > 0:
          return <Images images={images.profileImage} removeImage={this.removeImage} />
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

const mapStateToProps = state => ({
  images: state.profileImage
})

export default connect(mapStateToProps, { profileImageUpload, profileImageDelete })(ImageUploader)
