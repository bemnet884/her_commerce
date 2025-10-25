import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { roles, userRoles, artistProfiles, agentProfiles } from "@/db/schema";

export async function getUserRoles(userId: string) {
  const userRolesData = await db
    .select({ roleName: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));

  return userRolesData.map((ur) => ur.roleName);
}

export async function getUserProfileData(userId: string) {
  const [artistProfile, agentProfile] = await Promise.all([
    db.query.artistProfiles.findFirst({
      where: eq(artistProfiles.userId, userId),
    }),
    db.query.agentProfiles.findFirst({
      where: eq(agentProfiles.userId, userId),
    }),
  ]);
  return { artistProfile, agentProfile };
}
