import Link from 'next/link'

const Hero = (props) => (
  <React.Fragment>
    <div className="hero-container">
      <div className="hero-image">
      </div>
      <div className="hero-description">
        <h1>Welcome to the future of beauty</h1>
        <h2>{ props.subheadline }</h2>
        <Link href="/account/joining-as"><a href="/account/joining-as" className='hero-button'>Get Started</a></Link>
      </div>
    </div>
  </React.Fragment>
)

export default Hero
