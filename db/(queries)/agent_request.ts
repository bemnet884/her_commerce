import { eq } from "drizzle-orm";
import db from "../drizzle";
import { agent_requests, products } from "../schema";

export const createAgentRequest = async () => {
  return await db
    .insert(agent_requests)
    .values({
      artist_id: 1, // valid artist user id
      agent_id: null, // optional initially
      status: "pending",
      location: "Addis Ababa",
    })
    .returning({
      id: agent_requests.id,
      artist_id: agent_requests.artist_id,
      agent_id: agent_requests.agent_id,
      status: agent_requests.status,
      location: agent_requests.location,
    });
};

export const getAllAgentRequests = async () => {
  return db.query.agent_requests.findFirst();
};

export const getAgentRequestById = async (id: number) => {
  return await db
    .select()
    .from(agent_requests)
    .where(eq(agent_requests.id, id));
};

export const getRequestsByArtist = async (artistId: number) => {
  return await db
    .select()
    .from(agent_requests)
    .where(eq(agent_requests.artist_id, artistId));
};

export const updateAgentRequest = async (
  id: number,
  status: string,
  agentId?: number
) => {
  return await db
    .update(agent_requests)
    .set({
      status,
      agent_id: agentId ?? null,
    })
    .where(eq(agent_requests.id, id))
    .returning({
      id: agent_requests.id,
      status: agent_requests.status,
      agent_id: agent_requests.agent_id,
    });
};

export const deleteAgentRequest = async (id: number) => {
  return await db
    .delete(agent_requests)
    .where(eq(agent_requests.id, id))
    .returning({ id: agent_requests.id });
};
