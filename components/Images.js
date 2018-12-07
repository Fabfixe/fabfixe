

export default props =>
  props.images.map((image, i) => {

    let imageStyle = {
      width: '168px',
      height: '168px',
      margin: '0 auto',
      backgroundImage: `url(${image.secure_url})`,
      backgroundSize: 'cover',
      backgroundPosition: '50%',
    }

    return (
      <div  key={i} className='fade-in' style={imageStyle}>
        <div onClick={() => props.removeImage(image.public_id)} className='delete'>
          <p>X</p>
        </div>
      </div>
    )
  })
