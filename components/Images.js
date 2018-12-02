const imageStyle = {
  width: '168px',
  height: '168px',
  margin: '0 auto'
}

export default props =>
  props.images.map((image, i) =>
    <div key={i} className='fade-in' style={imageStyle}>
      <div onClick={() => props.removeImage(image.public_id)} className='delete'>
      <p>X</p>
    </div>
      <img src={image.secure_url} alt='' />
    </div>
  )
