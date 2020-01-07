const cn = require('classnames')

const Heading = (props) => (
  <div className={cn('heading-container', props.alignment)}>
    <h1 style={props.style}>{props.children}</h1>
    <div className="line" />
  </div>
)

export default Heading
