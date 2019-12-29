const Hero = (props) => (
  <React.Fragment>
    <div className="hero-container">
      <div className="hero-description">
        <h1>{ props.headline }</h1>
        <h2>{ props.subheadline }</h2>
      </div>
      <div className="hero-image" />
    </div>
  </React.Fragment>
)

export default Hero
