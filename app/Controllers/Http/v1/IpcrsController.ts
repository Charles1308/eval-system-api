import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ipcr from 'App/Models/Ipcr'

export default class IpcrsController {
  public async index({ response }: HttpContextContract) {
    const ipcr = await Ipcr.all()

    return response.ok(ipcr)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const payload = JSON.stringify(request.body().payload)

    try {
      const ipcr = await Ipcr.create({ payload })

      return response.created(ipcr)
    } catch (err) {
      console.log(err)
      return response.notImplemented('Server Error')
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params()

    try {
      const ipcr = await Ipcr.findOrFail(id)

      return response.ok(ipcr)
    } catch (err) {
      console.log(err)
      return response.notFound('That IPCR may not exist')
    }
  }

  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const { id } = request.params()

    if (!request.body().payload) {
      return response.badRequest('Payload is required')
    }

    const payload = JSON.stringify(request.body().payload)

    try {
      const ipcr = await Ipcr.findOrFail(id)
      ipcr.payload = payload

      await ipcr?.save()
      return response.ok(ipcr)
    } catch (err) {
      console.log(err)
      return response.notFound('That IPCR may not exist')
    }
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    const { id } = request.params()

    const ipcr = await Ipcr.findOrFail(id)

    await ipcr.delete()
    return response.ok('Successfully Deleted')
  }
}
