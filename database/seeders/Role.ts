import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Role.createMany([
      {
        name: 'DEAN',
        permissions: ['create-opcr', 'view-opcr']
      },
      {
        name: 'FACULTY',
        permissions: [
          'create-ipcr',
          'view-ipcr',
          'create-opcr',
          'view-opcr',
        ]
      },
      {
        name: 'DEPARTMENT-CHAIRPERSON',
        permissions: [
          'create-ipcr',
          'view-ipcr',
          'view-opcr',
          'print-ipcr',
          'print-opcr',
        ]
      },
      {
        name: 'STAFF',
        permissions: [ 'print-ipcr', 'print-opcr' ]
      },
    ])
  }
}
