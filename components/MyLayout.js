import Nav from './Nav'
const cn = require('classnames')

const Layout = (props) => (
  <React.Fragment>
    <Nav />
    <div className={cn(props.alignment, props.justify, props.background, props.scroll, props.width, props.home)}>
      {props.children}
    </div>
  </React.Fragment>
)

export default Layout
