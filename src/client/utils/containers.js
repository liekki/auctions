import React from 'react'
import EventEmitter from 'events'
import Promise from 'bluebird'
import R from 'ramda'
import { createAction } from 'utils/store'

const LoadingIndicator = () => (<div>Loading</div>)
const ApiError = () => (<div>API error!</div>)

export function withEvents(Component) {
  return (props) => {
    const events = new EventEmitter()
    const emit = (name) => (e) => events.emit(name, e)
    return <Component events={events} emit={emit} {...props} />
  }
}

export function withUnmount$(Component) {
  return React.createClass({
    getInitialState() {
      const [ unmount, unmount$ ] = createAction()
      return { unmount, unmount$ }
    },
    componentWillUnmount() {
      this.state.unmount()
    },
    render() {
      return <Component unmount$={this.state.unmount$} {...this.props} />
    }
  })
}

export function addObs(obsFn, Component) {
  const noop = () => {}
  return React.createClass({
    componentWillMount() {
      const obss = obsFn(this.props)
      this.setState(obss)
      Object.values(obss).forEach((obs) => obs.onValue(noop))
    },
    componentWillUnmount() {
      Object.values(this.state).forEach((obs) => obs.offValue(noop))
    },
    render() {
      return <Component {...this.props} {...this.state} />
    }
  })
}

export function waitForPromises(mapPropsToPromisesFn, shouldComponentReloadFn, Component, ErrorComponent = ApiError) {
  return React.createClass({
    getInitialState() {
      return {
        state: 'LOADING',
        props: this.props
      }
    },
    componentWillMount() {
      this.handlePromises(this.props)
    },

    handlePromises(props) {
      const promiseMap = mapPropsToPromisesFn(props)
      const promiseNames = Object.keys(promiseMap)
      const promises = Object.values(promiseMap)
      Promise.all(promises)
        .then((resolvedPromises) => R.zipObj(promiseNames, resolvedPromises))
        .then((resolvedProps) => setImmediate(() => this.setState({ state: 'READY', resolvedProps })))
        .catch((error) => setImmediate(() => this.setState({ state: 'ERROR', error })))
    },

    componentWillReceiveProps(props) {
      if(shouldComponentReloadFn(this.props, props)) {
        this.setState({ state: 'LOADING', props })
        this.handlePromises(props)
      } else {
        this.setState({ props })
      }
    },
    render() {
      const { state, props, resolvedProps, error } = this.state

      if (state === 'LOADING') {
        return (
          <LoadingIndicator />
        )
      } else if (state === 'READY') {
        return (
          <Component {...props} {...resolvedProps} />
        )
      } else if (state === 'ERROR') {
        return (
          <ErrorComponent error={error} />
        )
      }
    }
  })
}

export function checkAccess(accessFn, Component) {
  return waitForPromises(
    props => ({ hasAccess: Promise.resolve(accessFn(props)) }),
    ({ hasAccess, ...props }) => hasAccess ? <Component {...props} /> : <NotFound />
  )
}

export function makeSubNavi(links) {
  return () => <SubNavigation links={links} />
}
