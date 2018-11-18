import '../scss/hero.scss'

const Hero = (props) => (
  <React.Fragment>
    <div className="hero-container">
      <h1>{ props.headline }</h1>
      <h2>{ props.subheadline }</h2>
    </div>
  </React.Fragment>
)

export default Hero
