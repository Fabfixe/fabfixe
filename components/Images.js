export default (props) => {
  return props.images.map(({url}, i) => {
    let imageStyle = {
      width: '168px',
      height: '168px',
      margin: '0 auto',
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: '50%',
    }

    return (
      <div  key={i} className='fade-in' style={imageStyle}>
        {url !== '' && <div onClick={() => props.removeImage()} className='delete'>
          <p style={{ cursor: 'pointer' }}>✕</p>
        </div>}
      </div>
    )
  })
}
