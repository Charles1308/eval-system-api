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
    const username = request.input('username')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(username, password)

      return response.ok({
        token,
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
      emai: payload.email,
      username: payload.username,
    }

    const user = await User.firstOrCreate(searchPayload, payload)

    if (user.$isLocal) {
      const token = auth.use('api').generate(user)

      return response.created({
        token,
        message: 'Account Created Successfully',
      })
    } else {
      return response.badRequest('Account already exist')
    }
  }

  // Edit Account
  public async update({ auth, request, response }: HttpContextContract) {
    const { id } = request.params()
    const payload = await request.validate(UserValidator)
    await auth.use('api').authenticate()

    if (auth.use('api').isLoggedIn) {
      const user = await User.findOrFail(id)

      try {
        user.merge(payload)
        await user.save()
        const token = auth.use('api').generate(user)

        return response.accepted({
          token,
          message: 'Successfully Updated Account',
        })
      } catch (err) {
        console.log('Error Auth Controller: ', err)
        return response.internalServerError('Server Error')
      }
    } else {
      return response.forbidden('Account already exist')
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
