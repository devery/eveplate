import jwt from 'jwt-simple'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

require('dotenv').config()

// Create JWT strategy
const jwtLogin = new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: process.env.JWT_SECRET
}, (payload, done) => {
  let now = new Date().getTime()
  let expireDate = new Date(payload.expire).getTime()
  if (expireDate < now) {
    done(null, false)
    return
  }
  done(null, payload._id)
})

passport.use(jwtLogin)

export const ACCOUNT_ID_PROPERTY = '__auth_id__'

export const requireAuth = passport.authenticate('jwt', {
  session: false,
  assignProperty: ACCOUNT_ID_PROPERTY
})

/**
 * auto update token
 * @param _id
 * @returns {Uint8Array}
 * @private
 */
export function _issueToken(_id) {
  return jwt.encode({
    _id,
    expire: new Date().getTime() + process.env.JWT_VALID_DAYS * 24 * 60 * 60 * 1000
  }, process.env.JWT_SECRET)
}
