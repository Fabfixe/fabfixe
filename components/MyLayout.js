import '../scss/mylayout.scss'

const Layout = (props) => (
  <div className={ props.alignment }>
    {props.children}
  </div>
)

export default Layout
