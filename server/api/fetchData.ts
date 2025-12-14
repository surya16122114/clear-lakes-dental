import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DatabaseEntry } from "~/types/database";

// Example of how to get data from supabase though Nuxt's server API

export default defineEventHandler(async (event) => {
  // Verify user is authenticated
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized - Please log in",
    });
  }

  const body = await readBody<{ table: string }>(event);
  const client = await serverSupabaseClient(event);
  const { data, error } = await getTableData(client, body.table);
  //   const { data, error } = await getStorageUrl(client, body);
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to fetch data from database",
    });
  }
  // Return empty array if no data, otherwise return the data
  return (data || []) as DatabaseEntry[];
});

// Quick example of how to query a table
async function getTableData(client: SupabaseClient, tableName: string) {
  const { data, error } = await client.from(tableName).select("*").order("created_at", { ascending: false });
  return { data, error };
}

// Quick example of how to get an images public url. Will not work if a bucket is private.
async function getStorageUrl(client: SupabaseClient, body: any) {
  const { data } = await client.storage
    .from(body.bucket)
    .getPublicUrl(body.fileName);

  return data;
}
