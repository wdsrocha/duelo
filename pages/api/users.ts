import { supabase } from "../../lib/Supabase";

// Example of how to verify and get user data server-side.
export default async function (req, res) {
  const token = req.headers.token;
  const { data: user, error } = await supabase.auth.api.getUser(token);

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.status(200).json(user);
}
