import { 
  type User, 
  type InsertUser, 
  type Project, 
  type InsertProject, 
  type UpdateProject,
  type PlanType,
  type UserApiKey,
  type PasswordResetToken,
  users, 
  projects,
  userApiKeys,
  passwordResetTokens
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { encryptApiKey, decryptApiKey, maskApiKey } from "./encryption";

export interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  planBreakdown: { plan: string; count: number }[];
  recentUsers: User[];
  recentProjects: (Project & { userEmail: string })[];
}

export interface UserWithStats extends User {
  projectCount: number;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPlan(userId: string, plan: PlanType): Promise<User | undefined>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<User | undefined>;
  
  getProjectsByUser(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  countProjectsByUser(userId: string): Promise<number>;
  
  getUserApiKeys(userId: string): Promise<{ provider: string; maskedKey: string; id: string }[]>;
  getUserApiKey(userId: string, provider: string): Promise<string | null>;
  setUserApiKey(userId: string, provider: string, apiKey: string): Promise<void>;
  deleteUserApiKey(userId: string, provider: string): Promise<boolean>;
  
  createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<boolean>;
  
  getAdminStats(): Promise<AdminStats>;
  getAllUsers(): Promise<UserWithStats[]>;
  getAllProjects(): Promise<(Project & { userEmail: string })[]>;
  updateUser(userId: string, data: { plan?: PlanType; isAdmin?: boolean }): Promise<User | undefined>;
  deleteUser(userId: string): Promise<boolean>;
  adminDeleteProject(projectId: string): Promise<boolean>;
  suspendUser(userId: string): Promise<User | undefined>;
  reactivateUser(userId: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserPlan(userId: string, plan: PlanType): Promise<User | undefined> {
    const result = await db.update(users).set({ plan }).where(eq(users.id, userId)).returning();
    return result[0];
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<User | undefined> {
    const result = await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId)).returning();
    return result[0];
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: string, project: UpdateProject): Promise<Project | undefined> {
    const result = await db.update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  async countProjectsByUser(userId: string): Promise<number> {
    const result = await db.select().from(projects).where(eq(projects.userId, userId));
    return result.length;
  }

  async getUserApiKeys(userId: string): Promise<{ provider: string; maskedKey: string; id: string }[]> {
    const keys = await db.select().from(userApiKeys).where(eq(userApiKeys.userId, userId));
    return keys.map(k => {
      try {
        const decrypted = decryptApiKey(k.encryptedKey);
        return {
          id: k.id,
          provider: k.provider,
          maskedKey: maskApiKey(decrypted)
        };
      } catch {
        return {
          id: k.id,
          provider: k.provider,
          maskedKey: '****invalid****'
        };
      }
    });
  }

  async getUserApiKey(userId: string, provider: string): Promise<string | null> {
    const result = await db.select()
      .from(userApiKeys)
      .where(and(eq(userApiKeys.userId, userId), eq(userApiKeys.provider, provider)))
      .limit(1);
    
    if (result.length === 0) return null;
    
    try {
      return decryptApiKey(result[0].encryptedKey);
    } catch {
      return null;
    }
  }

  async setUserApiKey(userId: string, provider: string, apiKey: string): Promise<void> {
    const encrypted = encryptApiKey(apiKey);
    
    const existing = await db.select()
      .from(userApiKeys)
      .where(and(eq(userApiKeys.userId, userId), eq(userApiKeys.provider, provider)))
      .limit(1);
    
    if (existing.length > 0) {
      await db.update(userApiKeys)
        .set({ encryptedKey: encrypted, updatedAt: new Date() })
        .where(and(eq(userApiKeys.userId, userId), eq(userApiKeys.provider, provider)));
    } else {
      await db.insert(userApiKeys).values({
        userId,
        provider,
        encryptedKey: encrypted
      });
    }
  }

  async deleteUserApiKey(userId: string, provider: string): Promise<boolean> {
    const result = await db.delete(userApiKeys)
      .where(and(eq(userApiKeys.userId, userId), eq(userApiKeys.provider, provider)))
      .returning();
    return result.length > 0;
  }

  async createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    const result = await db.insert(passwordResetTokens).values({
      userId,
      token,
      expiresAt
    }).returning();
    return result[0];
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const result = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).limit(1);
    return result[0];
  }

  async markPasswordResetTokenUsed(token: string): Promise<boolean> {
    const result = await db.update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.token, token))
      .returning();
    return result.length > 0;
  }

  async getAdminStats(): Promise<AdminStats> {
    const allUsers = await db.select().from(users);
    const allProjects = await db.select().from(projects);
    
    const planCounts = allUsers.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const planBreakdown = Object.entries(planCounts).map(([plan, count]) => ({
      plan,
      count
    }));
    
    const recentUsers = allUsers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    const recentProjectsRaw = allProjects
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    const recentProjects = await Promise.all(
      recentProjectsRaw.map(async (project) => {
        const user = await this.getUser(project.userId);
        return {
          ...project,
          userEmail: user?.email || 'Unknown'
        };
      })
    );
    
    return {
      totalUsers: allUsers.length,
      totalProjects: allProjects.length,
      planBreakdown,
      recentUsers,
      recentProjects
    };
  }

  async getAllUsers(): Promise<UserWithStats[]> {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        const projectCount = await this.countProjectsByUser(user.id);
        return {
          ...user,
          projectCount
        };
      })
    );
    
    return usersWithStats;
  }

  async getAllProjects(): Promise<(Project & { userEmail: string })[]> {
    const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));
    
    const projectsWithUser = await Promise.all(
      allProjects.map(async (project) => {
        const user = await this.getUser(project.userId);
        return {
          ...project,
          userEmail: user?.email || 'Unknown'
        };
      })
    );
    
    return projectsWithUser;
  }

  async updateUser(userId: string, data: { plan?: PlanType; isAdmin?: boolean }): Promise<User | undefined> {
    const result = await db.update(users).set(data).where(eq(users.id, userId)).returning();
    return result[0];
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, userId)).returning();
    return result.length > 0;
  }

  async adminDeleteProject(projectId: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, projectId)).returning();
    return result.length > 0;
  }

  async suspendUser(userId: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ suspended: true, suspendedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async reactivateUser(userId: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ suspended: false, suspendedAt: null })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
