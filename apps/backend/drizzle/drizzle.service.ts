


// In-memory mock DrizzleService for local development
interface User {
  id: string;
  email: string;
  name?: string;
  googleId?: string;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
interface Membership {
  userId: string;
  organizationId?: string;
  role?: string;
}
interface RefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
  user?: User;
}

const users: User[] = [];
const memberships: Membership[] = [
  // By default, every new user will get a membership for testing
];
const refreshTokens: RefreshToken[] = [];

export class DrizzleService {
  user = {
    async findFirst({ where }) {
      return users.find(
        u => (where.OR?.some(
          cond => (cond.email && cond.email === u.email) || (cond.googleId && cond.googleId === u.googleId)
        ))
      );
    },
    async create({ data }) {
      const user = { ...data, id: (users.length + 1).toString(), createdAt: new Date(), updatedAt: new Date() };
      users.push(user);
      // Add a default membership for every new user
      memberships.push({ userId: user.id, organizationId: 'org1', role: 'user' });
      return user;
    },
    async update({ where, data }) {
      const user = users.find(u => u.id === where.id);
      if (user) Object.assign(user, data);
      return user;
    },
    async findUnique({ where }) {
      return users.find(u => u.id === where.id);
    }
  };
  membership = {
    async findFirst({ where }) {
      return memberships.find(m => m.userId === where.userId) || null;
    }
  };
  refreshToken = {
    async create({ data }) {
      const token = { ...data };
      refreshTokens.push(token);
      return token;
    },
    async findUnique({ where }) {
      return refreshTokens.find(rt => rt.token === where.token) || null;
    }
  };
}
