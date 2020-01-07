import Heading from '../components/Heading'
import Button from '../components/Button'
import Link from 'next/link'

const HowItWorks = (props) => (
  <div id="how-it-works" className="how-container">
    <Heading alignment="right">{props.heading || "How It Works"}</Heading>
    <div className="how-things-container">
      <div className="how-image">
        <img src='/img/purple_hero.png'/>
      </div>
      <div className="how-things">
        <div className="thing1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        <div className="thing2">Aliquam accumsan ipsum a purus mollis convallis.</div>
        <div className="thing3">Vestibulum tempus diam ex, in porttitor ex vulputate non.</div>
      </div>
    </div>

    <div className="button-container">
      <Link href={`/accountType?${props.actionLink}`} as={`${props.actionLink}`}>
        <a className='how-button'>Get Started</a>
      </Link>
    </div>
  </div>
)

export default HowItWorks
