import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    email: schema.string.optional({}, [rules.email()]),
    // password: schema.string({}, [rules.confirmed(), rules.minLength(8), rules.required()]),
    password: schema.string.optional({}, [rules.minLength(8)]),

    firstName: schema.string.optional({}, [rules.minLength(2)]),
    lastName: schema.string.optional({}, [rules.minLength(2)]),
    middleName: schema.string.optional(),

    role: schema.enum.optional(['FACULTY', 'DEPARTMENT-CHAIRPERSON', 'STAFF', 'DEAN'] as const),
    course: schema.string.optional({}, [rules.minLength(4)]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    required: '{{ field }} is required',
    enum: '{{ field }} must only be in {{ options.choices }}',
    minLength: '{{ field }} length must not below {{ options.minLength }}',
  }
}
