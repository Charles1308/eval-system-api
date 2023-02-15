import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import UserUpdateValidator from 'App/Validators/UserUpdateValidator'

export default class AuthenticationController {
  // Verify
  public async verify({ auth, response }: HttpContextContract) {
    await auth.use('api').check()
    const user = auth.use('api').user

    if (auth.use('api').isLoggedIn) {
      return response.ok(user)
    } else {
      return response.unauthorized({
        message: 'Invalid credentials',
      })
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
      return response.unauthorized({
        message: 'Invalid credentials',
      })
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
      return response.badRequest({
        message: 'Account already exist',
      })
    }
  }

  // Edit Account
  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user

    let id
    if (user) {
      id = user.id

      const payload = await request.validate(UserUpdateValidator)

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
          return response.internalServerError({
            message: 'Server Error',
          })
        }
      } else {
        return response.forbidden({
          message: 'Please login first',
        })
      }
    }
  }

  // Logout
  public async destroy({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()

    return response.ok({
      message: 'Successfully logged out',
    })
  }

  // Password check
  public async passwordCheck({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    const { password } = request.body()

    const id = auth.use('api').user?.id

    const userDB = await User.findOrFail(id)
    const result = await Hash.verify(userDB.password, password)

    return response.ok(result)
  }
}
