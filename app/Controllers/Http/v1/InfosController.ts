import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class InfosController {
  public async index({ response }: HttpContextContract) {
    try {
      // Get total numbers of submitted forms
      const totalSubmitted = await Database.rawQuery('SELECT ((SELECT COUNT(*) FROM opcrs) + (SELECT COUNT(*) FROM ipcrs)) AS total_submitted')
    
      // Get total numbers of total users
      const totalUsers = await Database.from('users').count('* as total_users')
  
      // Get total numbers of submitted forms for each month in the current year
      const currentYear = new Date().getFullYear()
      const query = `
        SELECT
          DATE_FORMAT(created_at, '%Y-%m-01') as month,
          SUM(count) as count
        FROM (
          SELECT
            created_at,
            COUNT(*) as count
          FROM
            opcrs
          WHERE
            created_at >= '${currentYear}-01-01'
          GROUP BY
            1
          UNION ALL
          SELECT
            created_at,
            COUNT(*) as count
          FROM
            ipcrs
          WHERE
            created_at >= '${currentYear}-01-01'
          GROUP BY
            1
        ) subquery
        GROUP BY
          1
        ORDER BY
          1 ASC
      `
      const graphData = await Database.rawQuery(query)
      
      const formsQuery = (type) => `
        SELECT
          DATE_FORMAT(created_at, '%Y-%m-01') as month,
          SUM(count) as count
        FROM (
          SELECT
            created_at,
            COUNT(*) as count
          FROM
            ${type}
          WHERE
            created_at >= '${currentYear}-01-01'
          GROUP BY
            1
        ) subquery
        GROUP BY
          1
        ORDER BY
          1 ASC;
      `
      const opcrs = await Database.rawQuery(formsQuery('opcrs'))
      const ipcrs = await Database.rawQuery(formsQuery('ipcrs'))

      const data = {
        totalSubmitted: totalSubmitted[0][0].total_submitted,
        totalUsers: totalUsers[0].total_users,
        graphData: graphData[0],
        ipcrs: ipcrs[0],
        opcrs: opcrs[0],
      }
  
      return response.ok(data)
    } catch (error) {
      console.log(error)
      return response.internalServerError('Please try again')
    }
  }
}
