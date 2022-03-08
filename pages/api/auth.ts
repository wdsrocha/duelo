import { supabase } from "../../lib/Supabase";

export default function handler(req, res) {
  supabase.auth.api.setAuthCookie(req, res);
}
