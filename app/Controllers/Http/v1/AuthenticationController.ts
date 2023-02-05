import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class AuthenticationController {
  // Verify
  public async verify({ auth, response }: HttpContextContract) {
    await auth.use('api').check()

    if (auth.use('api').isLoggedIn) {
      return response.ok('Authorized')
    } else {
      return response.unauthorized('Invalid credentials')
    }
  }

  // Login
  public async index({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.body()

    try {
      const userToken = await auth.use('api').attempt(email, password)
      const { type, token, user } = userToken

      return response.ok({
        type,
        token,
        user,
        message: 'Successfully logged in',
      })
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  // Register
  public async store({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(UserValidator)

    const searchPayload = {
      email: payload.email,
    }

    const userData = await User.firstOrCreate(searchPayload, payload)

    if (userData.$isLocal) {
      const userToken = await auth.use('api').generate(userData)

      const { type, token, user } = userToken

      // console.log(auth.user)
      return response.created({
        type,
        token,
        user,
        message: 'Account Created Successfully',
      })
    } else {
      return response.badRequest('Account already exist')
    }
  }

  // Edit Account
  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user

    let id
    if (user) {
      id = user.id
    
      const payload = await request.validate(UserValidator)
      if (auth.use('api').isLoggedIn) {
        const userDB = await User.findOrFail(id)

        try {
          userDB.merge(payload)
          await userDB.save()
          const userToken = await auth.use('api').generate(userDB)

          const { type, token, user } = userToken

          return response.accepted({
            type,
            token,
            user,
            message: 'Successfully Updated Account',
          })
        } catch (err) {
          console.log('Error Auth Controller: ', err)
          return response.internalServerError('Server Error')
        }
      } else {
        return response.forbidden('Please login first')
      }
    }
  }

  // Logout
  public async destroy({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()

    return response.status(200).json({
      message: 'Successfully logged out',
    })
  }
}
