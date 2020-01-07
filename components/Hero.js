import Link from 'next/link'
import Heading from './Heading'

const Hero = (props) => (
  <React.Fragment>
    <div className="hero-container">
      <div className="hero-images">
        <div id="bg-image-one" />
        <div id="bg-image-two" />
      </div>
      <div className="hero-description">
        <h1>Welcome to the future of beauty</h1>
        <h2>{ props.subheadline }</h2>
        <Link><a href="/account/joining-as" className='hero-button'>Get Started</a></Link>
      </div>
    </div>
  </React.Fragment>
)

export default Hero
