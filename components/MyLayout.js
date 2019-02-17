import Nav from './Nav'

const Layout = (props) => (
  <React.Fragment>
    <Nav />
    <div className={ props.alignment }>
      {props.children}
    </div>
  </React.Fragment>
)

export default Layout
