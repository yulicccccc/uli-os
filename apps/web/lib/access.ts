import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

export interface AccessIdentity {
  readonly subject: string;
  readonly email: string;
}

export class AccessDeniedError extends Error {
  constructor(message = "Access denied") {
    super(message);
    this.name = "AccessDeniedError";
  }
}

const jwksByTeamDomain = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getJwks(teamDomain: string) {
  const cached = jwksByTeamDomain.get(teamDomain);
  if (cached) return cached;

  const jwks = createRemoteJWKSet(
    new URL(`${teamDomain.replace(/\/$/, "")}/cdn-cgi/access/certs`),
  );
  jwksByTeamDomain.set(teamDomain, jwks);
  return jwks;
}

function readRequiredEnvironment() {
  const audience = process.env.POLICY_AUD;
  const teamDomain = process.env.TEAM_DOMAIN;
  const allowedEmail = process.env.ULI_ALLOWED_EMAIL;

  if (!audience || !teamDomain || !allowedEmail) {
    throw new AccessDeniedError("Access validation is not configured.");
  }

  return {
    audience,
    teamDomain: teamDomain.replace(/\/$/, ""),
    allowedEmail: allowedEmail.toLowerCase(),
  };
}

function identityFromPayload(payload: JWTPayload): AccessIdentity {
  const email = typeof payload.email === "string" ? payload.email.toLowerCase() : "";
  const subject = typeof payload.sub === "string" ? payload.sub : "";

  if (!email || !subject) {
    throw new AccessDeniedError("Access token is missing identity claims.");
  }

  return { email, subject };
}

export async function verifyAccessRequest(request: Request): Promise<AccessIdentity> {
  const { audience, teamDomain, allowedEmail } = readRequiredEnvironment();
  const token = request.headers.get("cf-access-jwt-assertion");

  if (!token) {
    throw new AccessDeniedError("Missing Cloudflare Access assertion.");
  }

  try {
    const { payload } = await jwtVerify(token, getJwks(teamDomain), {
      issuer: teamDomain,
      audience,
    });

    const identity = identityFromPayload(payload);
    if (identity.email !== allowedEmail) {
      throw new AccessDeniedError("This identity is not authorized for Uli OS.");
    }

    return identity;
  } catch (error) {
    if (error instanceof AccessDeniedError) throw error;
    throw new AccessDeniedError("Cloudflare Access assertion is invalid.");
  }
}
