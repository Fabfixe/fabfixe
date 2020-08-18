import Button from '../components/Button'
import Link from 'next/link'

const HowItWorks = (props) => (
  <div id="how-it-works" className="how-container">
    <ul className="how-list">
      <h1>{props.heading || "How It Works"}</h1>
      <li>
        <div className="one" />
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
      </li>
      <li>
        <div className="two" />
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
      </li>
      <li>
        <div className="three" />
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
      </li>
    </ul>
    <div className="button-container">
      <Link href={`/accountType?${props.actionLink}`} as={`${props.actionLink}`}>
        <a className='how-button'>Sign Me Up</a>
      </Link>
    </div>
  </div>
)

export default HowItWorks
