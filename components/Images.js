export default (props) => {
  console.log('final props', props)
  return props.images.map(({profileImageUrl}, i) => {
    let imageStyle = {
      width: '168px',
      height: '168px',
      margin: '0 auto',
      backgroundImage: `url(${profileImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: '50%',
    }

    return (
      <div  key={i} className='fade-in' style={imageStyle}>
        {profileImageUrl !== '' && <div onClick={() => props.removeImage()} className='delete'>
          <p style={{ cursor: 'pointer' }}>✕</p>
        </div>}
      </div>
    )
  })
}
