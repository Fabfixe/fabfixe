import Heading from '../components/Heading'
import Button from '../components/Button'
import Link from 'next/link'

const HowItWorks = (props) => (
  <div id="how-it-works" className="how-container">
    <Heading>{props.heading || "How It Works"}</Heading>
    <div className="thing1"></div>
    <div className="thing2"></div>
    <div className="thing3"></div>
    <div className="button-container">
      <Link href={ props.actionLink }>
        <Button>Get Started</Button>
      </Link>
    </div>
  </div>
)

export default HowItWorks
