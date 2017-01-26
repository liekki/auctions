import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { onNavigateTo$ } from 'actions'
import * as views from 'views'
import * as components from 'components'

const AppContainer = React.createClass({
  componentDidMount() {
    onNavigateTo$
      .takeWhile(() => this.isMounted())
      .onValue((path) => this.props.router.push(path))

    if(this.props.location.pathname === '/')
      this.focusInput()
  },
  focusInput() {
    document.getElementById('searchForm').focus()
  },
  componentDidUpdate(prevProps, prevState) {
    if(this.props.location.pathname === '/')
      this.focusInput()
  },
  render() {
    return this.props.children
  }
})
render((
  <Router history={browserHistory}>
    <Route component={AppContainer}>
      <Route path="/" component={views.App}>
        <IndexRoute components={{main: views.Home, header: components.HeaderDefault}} />
        <Route path="/search/:searchString" components={{main: views.ItemList, header: components.HeaderWide}} />
        <Route path="/item/:id/:suffix" components={{main: views.Item, header: components.HeaderWide}} />
        <Route path="*" components={{main: views.NotFound}} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'))
