import { schema, CustomMessages, rules, validator  } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = validator.reporters.api
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
    username: schema.string({}, [rules.minLength(4), rules.required()]),
    password: schema.string({}, [rules.confirmed(), rules.minLength(8), rules.required()]),
    email: schema.string({}, [rules.email(), rules.required()]),

    firstName: schema.string({}, [rules.minLength(2), rules.required()]),
    lastName: schema.string({}, [rules.minLength(2), rules.required()]),
    middleName: schema.string.nullableAndOptional(),

    office: schema.enum(
      [
        'Professor',
        'Instructor',
        'Guest Lecturer',
        'Assistant Professor',
        'Associate Professor',
        'Administrative Staff',
        'Coordinator (Associate Professor/Professor)',
        'Coordinator  (Instructor/Assistant Professor)',
      ] as const,
      [rules.required()]
    ),
    course: schema.string({}, [rules.minLength(4), rules.required()]),
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
