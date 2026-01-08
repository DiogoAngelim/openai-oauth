
// In-memory mock DrizzleService for local development
interface User {
  id: string
  email: string
  name?: string
  googleId?: string
  image?: string | null
  createdAt?: Date
  updatedAt?: Date
}
interface Membership {
  userId: string
  organizationId?: string
  role?: string
}
interface RefreshToken {
  userId: string
  token: string
  expiresAt: Date
  user?: User
}

const users: User[] = []
const memberships: Membership[] = [
  // By default, every new user will get a membership for testing
]
const refreshTokens: RefreshToken[] = []
// In-memory chat history for local development
interface Chat {
  id: string
  userId: string
  organizationId: string
  prompt: string
  response: string
  model: string
  createdAt: Date
}
const chats: Chat[] = []

export class DrizzleService {
  chats = {
    async findMany ({ where }: { where: { userId: string, organizationId: string } }) {
      return chats.filter(
        c => c.userId === where.userId && c.organizationId === where.organizationId
      )
    },
    async create ({ data }: { data: Omit<Chat, 'id' | 'createdAt'> & { id?: string, createdAt?: Date } }) {
      const chat: Chat = {
        id: (chats.length + 1).toString(),
        createdAt: new Date(),
        ...data
      }
      chats.push(chat)
      return chat
    }
  }

  user = {
    async findFirst ({ where }) {
      return users.find(
        u => Array.isArray(where.OR) && where.OR.some(
          cond => (
            typeof cond.email === 'string' && cond.email === u.email
          ) || (
            typeof cond.googleId === 'string' && cond.googleId === u.googleId
          )
        )
      )
    },
    async create ({ data }) {
      const user = { ...data, id: (users.length + 1).toString(), createdAt: new Date(), updatedAt: new Date() }
      users.push(user)
      // Add a default membership for every new user
      memberships.push({ userId: user.id, organizationId: 'org1', role: 'user' })
      return user
    },
    async update ({ where, data }) {
      const user = users.find(u => u.id === where.id)
      if (user != null) Object.assign(user, data)
      return user
    },
    async findUnique ({ where }) {
      return users.find(u => u.id === where.id)
    }
  }

  membership = {
    async findFirst ({ where }) {
      return (memberships.find(m => m.userId === where.userId) != null) || null
    }
  }

  refreshToken = {
    async create ({ data }) {
      const token = { ...data }
      refreshTokens.push(token)
      return token
    },
    async findUnique ({ where }) {
      return (refreshTokens.find(rt => rt.token === where.token) != null) || null
    }
  }
}
