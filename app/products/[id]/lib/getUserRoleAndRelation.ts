import { eq, and } from "drizzle-orm";
import db from "@/db/drizzle";
import { userRoles, roles, agentArtists } from "@/db/schema";

export async function getUserRolesAndRelations(
  userId: string,
  artistId?: string
) {
  const [userRolesList, agentRelation] = await Promise.all([
    // Get roles for the user
    db
      .select({
        roleName: roles.name,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId)),

    // Check if user is an active agent for this artist
    artistId
      ? db
          .select()
          .from(agentArtists)
          .where(
            and(
              eq(agentArtists.artistId, artistId),
              eq(agentArtists.isActive, true)
            )
          )
          .then((res) => res[0])
      : Promise.resolve(null),
  ]);

  return {
    roles: userRolesList.map((ur) => ur.roleName),
    isAgentForArtist: !!agentRelation,
  };
}
