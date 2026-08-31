import type { Profile } from "passport-google-oauth20";
import type { AuthPayload } from "./auth.type";

declare global {
  namespace Express {
    interface User extends Profile {}
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}

export {};
