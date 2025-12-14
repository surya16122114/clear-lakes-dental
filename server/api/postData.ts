import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DatabaseEntry } from "~/types/database";

// Follow documentation to add data to table/bucket
//    Database: https://supabase.com/docs/reference/javascript/upsert
//    Storage: https://supabase.com/docs/guides/storage/uploads/standard-uploads
export default defineEventHandler(async (event) => {
  // Verify user is authenticated
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized - Please log in",
    });
  }

  const body = await readBody<DatabaseEntry>(event);
  const client = await serverSupabaseClient(event);
  
  // Insert data into the table
  const { data, error } = await client
    .from("entries")
    .insert([{
      name: body.name,
      email: body.email,
      message: body.message,
    }] as any)
    .select();
  
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
  
  return data;
});
