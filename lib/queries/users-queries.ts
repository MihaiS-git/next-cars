'use server';

import { User } from "@/lib/definitions";
import { withDb } from "@/lib/util/db-helper";

export async function getUserByEmail(email: string): Promise<User | null> {
  return withDb('users', async (collection) => {
    const user = (await collection.findOne({ email })) as User | null;
    if (!user) return null;
    return user;
  });
}

export async function createNewUser(email: string, password: string) {
  return withDb('users', async (collection) => {
    const result = await collection.insertOne({ email, password });
    if (!result.acknowledged) return null;
    return { _id: result.insertedId, email };
  })
}
