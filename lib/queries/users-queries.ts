'use server';

import { User } from "@/lib/definitions";
import { withDb } from "@/lib/util/db-helper";

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = withDb('users', async (collection) => {
    const user = (await collection.findOne({ email })) as User | null;
    if (user) {
      user._id = user._id!.toString();
      return user;
    }
    return null;
  });
  return user;
}

export async function createNewUser(email: string, password: string) {
  return withDb('users', async (collection) => {
    const result = await collection.insertOne({ email, password });
    if (!result.acknowledged) return null;
    return { _id: result.insertedId, email };
  })
}
