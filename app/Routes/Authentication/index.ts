/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/auth/verify', 'AuthenticationController.verify')

  Route.post('/auth/sign-in', 'AuthenticationController.index')
  Route.post('/auth/sign-up', 'AuthenticationController.store')
  Route.delete('/auth/sign-out', 'AuthenticationController.destroy')

  Route.put('/auth/update', 'AuthenticationController.update')
})
  .prefix('/api/v1')
  .namespace('App/Controllers/Http/v1')
