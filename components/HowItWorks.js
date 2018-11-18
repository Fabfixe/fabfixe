import '../howitworks.scss'
import Heading from '../components/Heading'
import Button from '../components/Button'
import Link from 'next/link'

const HowItWorks = () => (
  <div id="how-it-works" className="how-container">
    <Heading>How It Works</Heading>
    <div className="thing1"></div>
    <div className="thing2"></div>
    <div className="thing3"></div>
    <Link href="/create-account">
      <Button>Get Started</Button>
    </Link>
  </div>
)

export default HowItWorks
