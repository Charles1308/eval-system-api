/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/verify', 'AuthenticationController.verify')

  Route.post('/sign-in', 'AuthenticationController.index')
  Route.post('/sign-up', 'AuthenticationController.store')
  Route.delete('/sign-out', 'AuthenticationController.destroy')

  Route.put('/update', 'AuthenticationController.update')
})
  .prefix('/api/v1/auth')
  .namespace('App/Controllers/Http/v1')
