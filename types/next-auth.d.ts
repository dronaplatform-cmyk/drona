import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      username: string
      isVerified: boolean
      createdAt: Date
      isStudentSession: boolean
      parentId?: string
      activeStudentId?: string
    } & DefaultSession["user"]
    activeStudentId?: string
  }

  interface User extends DefaultUser {
    role: string
    username: string
    isVerified: boolean
    createdAt: Date
    isStudentSession: boolean
    parentId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string
    username: string
    isVerified: boolean
    createdAt: Date
    isStudentSession: boolean
    parentId?: string
    activeStudentId?: string
  }
}
