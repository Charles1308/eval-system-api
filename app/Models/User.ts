import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { 
  column, 
  beforeSave, 
  BaseModel, 
  hasMany, 
  HasMany, 
  computed, 
  manyToMany, 
  ManyToMany, 
} from '@ioc:Adonis/Lucid/Orm'
import Ipcr from './Ipcr'
import Opcr from './Opcr'
import Role from './Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public middleName?: string

  @column()
  public role: string

  @column()
  public course: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Ipcr)
  public ipcrs: HasMany<typeof Ipcr>

  @hasMany(() => Opcr)
  public opcrs: HasMany<typeof Opcr>

  @manyToMany(() => Role, {
    pivotTable: 'user_role',
  })
  public roles: ManyToMany<typeof Role>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @computed()
  public get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
