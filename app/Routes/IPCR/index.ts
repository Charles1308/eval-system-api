/* eslint-disable prettier/prettier */
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'IpcrsController.index')

  Route.get('/:id', 'IpcrsController.show')
  Route.post('/', 'IpcrsController.store')
  Route.put('/:id', 'IpcrsController.update')

  Route.delete('/:id', 'IpcrsController.destroy')
})
  .prefix('/api/v1/form/ipcr')
  .namespace('App/Controllers/Http/v1')
