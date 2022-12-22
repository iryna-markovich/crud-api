import { v4 as uuid } from 'uuid'

interface UserRecord {
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

  public async update(id: string, data: UserRecord): Promise<UserRecord> {
    const user = this.users[id]

    return { ...user, ...data }
  }

  public async destroy(id: string): Promise<boolean> {
    return delete this.users[id]
  }
}
