/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'InfosController.index')
})
  .prefix('/api/v1')
  .namespace('App/Controllers/Http/v1')
