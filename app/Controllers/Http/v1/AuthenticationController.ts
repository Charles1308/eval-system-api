import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import UserValidator from 'App/Validators/UserValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import UserUpdateValidator from 'App/Validators/UserUpdateValidator'

export default class AuthenticationController {
  // Verify
  public async verify({ auth, response }: HttpContextContract) {
    await auth.use('api').check()
    const userAuth = auth.use('api').user

    if (userAuth?.id) {
      const userDBData = await User.findOrFail(userAuth?.id)
      await userDBData?.load('roles')

      if (auth.use('api').isLoggedIn) {
        return response.ok(userDBData)
      } else {
        return response.unauthorized({
          message: 'Invalid credentials',
        })
      }
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

      const userDBData = await User.find(user?.id)
      await userDBData?.load('roles')

      return response.ok({
        type,
        token,
        user: userDBData,
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

    const userData = await User.query().where({ email: payload.email }).first()
    const role = await Role.findByOrFail('name', request.body().roles)
    
    if (userData) {
      return response.badRequest({
        message: 'Account already exist',
      })
    } else {
      const newUser = await User.create(payload)
      await newUser.related('roles').attach([role.id])

      const userToken = await auth.use('api').generate(newUser)
      const { type, token, user } = userToken

      const userDBData = await User.find(user?.id)
      await userDBData?.load('roles')

      return response.created({
        type,
        token,
        user: userDBData,
        message: 'Account Created Successfully',
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
        const role = await Role.findByOrFail('name', request.body().roles)

        try {
          userDB.merge(payload)
          
          await userDB.save()
          await userDB.related('roles').sync([role.id])
          const userToken = await auth.use('api').generate(userDB)

          const { type, token, user } = userToken

          const userDBData = await User.find(user?.id)
          await userDBData?.load('roles')
    
          return response.accepted({
            type,
            token,
            user: userDBData,
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
