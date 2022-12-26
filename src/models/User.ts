import { v4 as uuid } from 'uuid'

export interface UserRecord {
  id: string
  username: string
  age: number
  hobbies: string[]
}

interface UsersMap {
  [index: string]: UserRecord
}

export default class User {
  private users: UsersMap = {}

  public async findAll(): Promise<UserRecord[]> {
    return Object.values(this.users)
  }

  public async findByPk(id: string): Promise<UserRecord | undefined> {
    return this.users[id]
  }

  public async create(data: UserRecord): Promise<UserRecord> {
    const id = uuid()
    const { username, age, hobbies } = data
    const newUser = { id, username, age, hobbies }

    this.users[id] = newUser

    return newUser
  }

  public async update(
    id: string,
    data: UserRecord
  ): Promise<UserRecord | undefined> {
    if (!this.users[id]) return undefined

    const user = { ...this.users[id], ...data }

    this.users = { ...this.users, [id]: user }

    return user
  }

  public async destroy(id: string): Promise<boolean | undefined> {
    if (!this.users[id]) return undefined

    return delete this.users[id]
  }
}
