/**
 * Environment-gated OIDC login.
 *
 * When `PAPERCLIP_OIDC_DISCOVERY_URL` + `PAPERCLIP_OIDC_CLIENT_ID` +
 * `PAPERCLIP_OIDC_CLIENT_SECRET` are all set, a single generic OAuth provider
 * is registered with Better Auth's `genericOAuth` plugin and the sign-in page
 * shows an SSO button. When any of them is unset the instance behaves exactly
 * like upstream: no plugin, no button, no route behaviour change.
 *
 * Optional variables:
 * - `PAPERCLIP_OIDC_PROVIDER_ID`   provider slug used in the redirect URL (default `oidc`)
 * - `PAPERCLIP_OIDC_PROVIDER_NAME` button label (default "Single Sign-On")
 * - `PAPERCLIP_OIDC_SCOPES`        space-separated scopes (default "openid email profile")
 */

const DEFAULT_PROVIDER_ID = "oidc";
const DEFAULT_PROVIDER_NAME = "Single Sign-On";
const DEFAULT_SCOPES = "openid email profile";

export type OidcEnvProviderConfig = {
  providerId: string;
  providerName: string;
  discoveryUrl: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
};

function env(name: string, envObj: NodeJS.ProcessEnv): string | undefined {
  const value = envObj[name]?.trim();
  return value ? value : undefined;
}

/**
 * Resolve the OIDC provider from the environment. Returns null unless every
 * required variable is present and non-empty.
 */
export function resolveOidcEnvProvider(
  envObj: NodeJS.ProcessEnv = process.env,
): OidcEnvProviderConfig | null {
  const discoveryUrl = env("PAPERCLIP_OIDC_DISCOVERY_URL", envObj);
  const clientId = env("PAPERCLIP_OIDC_CLIENT_ID", envObj);
  const clientSecret = env("PAPERCLIP_OIDC_CLIENT_SECRET", envObj);
  if (!discoveryUrl || !clientId || !clientSecret) return null;

  return {
    providerId: env("PAPERCLIP_OIDC_PROVIDER_ID", envObj) ?? DEFAULT_PROVIDER_ID,
    providerName: env("PAPERCLIP_OIDC_PROVIDER_NAME", envObj) ?? DEFAULT_PROVIDER_NAME,
    discoveryUrl,
    clientId,
    clientSecret,
    scopes: (env("PAPERCLIP_OIDC_SCOPES", envObj) ?? DEFAULT_SCOPES)
      .split(/\s+/)
      .filter(Boolean),
  };
}

/**
 * Public, secret-free description of the SSO button for the health endpoint.
 * Exposed only so the anonymous sign-in page can decide to render the button;
 * it intentionally contains no client secret and no endpoints.
 */
export function toPublicSsoLoginDescriptor(provider: OidcEnvProviderConfig) {
  return {
    providerId: provider.providerId,
    providerName: provider.providerName,
  };
}
