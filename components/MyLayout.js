import Nav from './Nav'

const Layout = (props) => (
  <React.Fragment>
    <Nav />
    <div style={{overflow: 'hidden'}}className={ props.alignment }>
      {props.children}
    </div>
  </React.Fragment>
)

export default Layout
