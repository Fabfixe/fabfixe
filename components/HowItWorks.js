import Button from '../components/Button'
import Link from 'next/link'

const HowItWorks = (props) => (
  <div id="how-it-works" className="how-container">
    <h1>{props.heading || "How It Works"}</h1>
    <ul className="how-list">
      <li>
        <img src="/img/how_step_one.png" />
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
      </li>
      <li>
        <img src="/img/how_step_two.png" />
        <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h2>
      </li>
      <li>
        <img src="/img/how_step_three.png" />
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
