import Button from '../components/Button'
import Link from 'next/link'

const JoinHome = (props) => (
  <div id="join-home">
    <h1>Your glow up starts here</h1>
    <div className="options-container">
      <h2>Sign up as a:</h2>
      <div>
      <Link href="/accountType?pupil" as="/join/pupil">
        <p className="join-link">Pupil</p>
      </Link>
      <Link href="/accountType?artist" as="/join/artist">
        <p className="join-link">Artist</p>
      </Link>
      </div>
    </div>
  </div>
)

export default JoinHome
