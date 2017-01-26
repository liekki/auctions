import basicAuth from 'basic-auth'
import config from 'nconf'

config.argv().env().file({file: './config.json'})

export default (req, res, next) => {
  const unauthorized = (res) => {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
    return res.send(401)
  }

  var user = basicAuth(req)

  if (!user || !user.name || !user.pass) {
    return unauthorized(res)
  }

  if (user.name === config.get('server').auth.user && user.pass === config.get('server').auth.pass) {
    return next()
  } else {
    return unauthorized(res)
  }
}
