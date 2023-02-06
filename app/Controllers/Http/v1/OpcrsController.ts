import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Opcr from 'App/Models/Opcr'

export default class OpcrsController {
  public async index({ response }: HttpContextContract) {
    const opcr = await Opcr.all()

    return response.ok({ opcr })
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const payload = JSON.stringify(request.body().payload)

    try {
      const opcr = await Opcr.create({
        userId: auth.user?.id,
        payload,
      })

      return response.created({
        opcr,
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
      const opcr = await Opcr.findOrFail(id)

      return response.ok({ opcr })
    } catch (err) {
      console.log(err)
      return response.notFound({
        message: 'That Opcr may not exist',
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
      const opcr = await Opcr.findOrFail(id)
      opcr.payload = payload

      await opcr?.save()
      return response.ok({
        opcr,
        message: 'Successfully Updated',
      })
    } catch (err) {
      console.log(err)
      return response.notFound({
        message: 'That Opcr may not exist',
      })
    }
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    const { id } = request.params()

    const opcr = await Opcr.findOrFail(id)

    await opcr.delete()
    return response.ok({
      message: 'Successfully Deleted',
    })
  }
}
