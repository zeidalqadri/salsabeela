interface User {
  id: string
  email: string
  role: string
  createdAt: string
}

export class AuthService {
  private users: Map<string, User> = new Map()

  async createUser(email: string, password: string, role: string): Promise<User> {
    const id = Math.random().toString(36).substring(7)
    const user: User = {
      id,
      email,
      role,
      createdAt: new Date().toISOString()
    }
    this.users.set(id, user)
    return user
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values())
  }
} 