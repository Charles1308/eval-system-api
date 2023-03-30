import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ipcr from 'App/Models/Ipcr'
import User from 'App/Models/User'

export default class IpcrsController {
  public async index({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    const { page, limit = 10 } = request.all()
    
    const authUser = auth.use('api').user
    await authUser?.load('roles')

    if (authUser?.roles && authUser.roles[0].name === 'FACULTY') {
      const userId = authUser.id
      const ipcr = await Ipcr.query().where('user_id', userId).preload('user').paginate(page, limit)
  
      return response.ok({ ipcr })
    } else {
      const ipcr = await Ipcr.query().preload('user').paginate(page, limit)
  
      return response.ok({ ipcr })
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const payload = JSON.stringify(request.body().payload)

    try {
      const ipcr = await Ipcr.create({
        userId: auth.user?.id,
        payload,
      })

      return response.created({
        ipcr,
        message: 'Successfully Created',
      })
    } catch (err) {
      console.log(err)
      return response.notImplemented({
        message: 'Server Error',
      })
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params()

    try {
      const ipcr = await Ipcr.query().where('id', id).preload('user').first()

      return response.ok({ ipcr })
    } catch (err) {
      console.log(err)
      return response.notFound({
        message: 'That IPCR may not exist',
      })
    }
  }

  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const { id } = request.params()

    if (!request.body().payload) {
      return response.badRequest({
        message: 'Payload is required',
      })
    }

    const payload = JSON.stringify(request.body().payload)

    try {
      const ipcr = await Ipcr.findOrFail(id)
      ipcr.payload = payload

      await ipcr?.save()
      return response.ok({
        ipcr,
        message: 'Successfully Updated',
      })
    } catch (err) {
      console.log(err)
      return response.notFound({
        message: 'That IPCR may not exist',
      })
    }
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    const { id } = request.params()

    const ipcr = await Ipcr.findOrFail(id)

    await ipcr.delete()
    return response.ok({
      message: 'Successfully Deleted',
    })
  }
}
