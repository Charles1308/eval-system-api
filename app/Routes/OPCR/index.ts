/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'OpcrsController.index')

  Route.get('/:id', 'OpcrsController.show')
  Route.post('/', 'OpcrsController.store')
  Route.put('/:id', 'OpcrsController.update')

  Route.delete('/:id', 'OpcrsController.destroy')
})
  .prefix('/api/v1/form/opcr')
  .namespace('App/Controllers/Http/v1')
