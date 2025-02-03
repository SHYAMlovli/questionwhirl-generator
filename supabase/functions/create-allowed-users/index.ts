import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedUsers = [
  { email: "rjrayan2548@gmail.com", password: "ranjan@qpgen" },
  { email: "qpgen1127@gmail.com", password: "qpgen@qpgen" },
  { email: "pavithranraja1729@gmail.com", password: "pavithran@qpgen" }
];

Deno.serve(async (req) => {
  try {
    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create users
    for (const user of allowedUsers) {
      try {
        const { data: existingUser } = await supabaseClient.auth.admin.getUserByEmail(user.email)
        
        if (!existingUser) {
          await supabaseClient.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true
          })
          console.log(`Created user: ${user.email}`)
        } else {
          console.log(`User already exists: ${user.email}`)
        }
      } catch (error) {
        console.error(`Error processing user ${user.email}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Users processed successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})