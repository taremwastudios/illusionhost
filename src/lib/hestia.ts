"use server";

/**
 * HestiaCP API Client
 * 
 * This client interacts with the HestiaCP REST API to manage:
 * - Web domains
 * - Databases
 * - Mail domains
 * - DNS records
 * - FTP users
 * 
 * API Documentation: https://docs.hestiacp.com/
 */

interface HestiaConfig {
  host: string;
  apiKey: string;
  adminUser: string;
}

interface HestiaResponse {
  result: string;
  msg: string;
  time: string;
  data?: unknown;
}

interface WebDomain {
  DOMAIN: string;
  IP: string;
  IP6: string;
  SSL: string;
  SSL_HOME: string;
  LETSENCRYPT: string;
  FTP_USER: string;
  FTP_PREFIX: string;
  U_DISK: number;
  U_BANDWIDTH: number;
  TPL: string;
  ALIASES: string;
  FASTCGI: string;
  CACHES: string;
  NGINX: string;
  PHP: string;
}

interface Database {
  DB: string;
  USER: string;
  HOST: string;
  TYPE: string;
  CHARSET: string;
  U_DISK: number;
}

interface MailDomain {
  DOMAIN: string;
  ANTISPAM: string;
  ANTIVIRUS: string  ;
  DKIM: string;
  SSL: string;
  LETSENCRYPT: string;
}

interface DNSRecord {
  id: string;
  record: string;
  type: string;
  value: string;
  priority: number;
  ttl: number;
}

function getConfig(): HestiaConfig | null {
  const host = process.env.HESTIA_HOST;
  const apiKey = process.env.HESTIA_API_KEY;
  const adminUser = process.env.HESTIA_ADMIN_USER || "admin";

  if (!host || !apiKey) {
    console.log("[HestiaCP] Configuration missing - API not available");
    return null;
  }

  return { host, apiKey, adminUser };
}

async function hestiaRequest(
  endpoint: string,
  method: "GET" | "POST" | "DELETE" = "GET",
  params?: Record<string, string>
): Promise<HestiaResponse | null> {
  const config = getConfig();
  if (!config) {
    return null;
  }

  const url = new URL(`${config.host}/api/v1${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        "API-Key": config.apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      console.error(`[HestiaCP] API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as HestiaResponse;
  } catch (error) {
    console.error("[HestiaCP] Request failed:", error);
    return null;
  }
}

/**
 * Check if HestiaCP is configured
 */
export async function isHestiaAvailable(): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;

  const response = await hestiaRequest("/list/user/admin/");
  return response?.result === "OK";
}

/**
 * List all web domains for a user
 */
export async function listWebDomains(user: string = "admin"): Promise<WebDomain[]> {
  const response = await hestiaRequest(`/list/user/${user}/web-domains`);
  
  if (!response || response.result !== "OK" || !response.data) {
    return [];
  }

  const data = response.data as Record<string, WebDomain>;
  return Object.values(data);
}

/**
 * Add a new web domain
 */
export async function addWebDomain(
  domain: string,
  user: string = "admin",
  options: {
    ip?: string;
    ssl?: boolean;
    letsencrypt?: boolean;
    php?: string;
  } = {}
): Promise<boolean> {
  const params: Record<string, string> = {
    domain,
    user,
  };

  if (options.ip) params.ip = options.ip;
  if (options.ssl !== undefined) params.ssl = options.ssl ? "yes" : "no";
  if (options.letsencrypt !== undefined) params.letsencrypt = options.letsencrypt ? "yes" : "no";
  if (options.php) params.php = options.php;

  const response = await hestiaRequest("/add/web-domain", "POST", params);
  return response?.result === "OK";
}

/**
 * Delete a web domain
 */
export async function deleteWebDomain(
  domain: string,
  user: string = "admin"
): Promise<boolean> {
  const response = await hestiaRequest("/delete/web-domain", "POST", {
    domain,
    user,
  });
  return response?.result === "OK";
}

/**
 * List all databases for a user
 */
export async function listDatabases(user: string = "admin"): Promise<Database[]> {
  const response = await hestiaRequest(`/list/user/${user}/databases`);
  
  if (!response || response.result !== "OK" || !response.data) {
    return [];
  }

  const data = response.data as Record<string, Database>;
  return Object.values(data);
}

/**
 * Add a new database
 */
export async function addDatabase(
  database: string,
  user: string = "admin",
  options: {
    dbUser?: string;
    dbPassword?: string;
    type?: string;
    charset?: string;
  } = {}
): Promise<boolean> {
  const params: Record<string, string> = {
    database,
    user,
  };

  if (options.dbUser) params.db_user = options.dbUser;
  if (options.dbPassword) params.db_password = options.dbPassword;
  if (options.type) params.type = options.type;
  if (options.charset) params.charset = options.charset;

  const response = await hestiaRequest("/add/database", "POST", params);
  return response?.result === "OK";
}

/**
 * Delete a database
 */
export async function deleteDatabase(
  database: string,
  user: string = "admin"
): Promise<boolean> {
  const response = await hestiaRequest("/delete/database", "POST", {
    database,
    user,
  });
  return response?.result === "OK";
}

/**
 * List all mail domains for a user
 */
export async function listMailDomains(user: string = "admin"): Promise<MailDomain[]> {
  const response = await hestiaRequest(`/list/user/${user}/mail-domains`);
  
  if (!response || response.result !== "OK" || !response.data) {
    return [];
  }

  const data = response.data as Record<string, MailDomain>;
  return Object.values(data);
}

/**
 * Add a new mail domain
 */
export async function addMailDomain(
  domain: string,
  user: string = "admin",
  options: {
    ssl?: boolean;
    letsencrypt?: boolean;
    antispam?: boolean;
    antivirus?: boolean;
  } = {}
): Promise<boolean> {
  const params: Record<string, string> = {
    domain,
    user,
  };

  if (options.ssl !== undefined) params.ssl = options.ssl ? "yes" : "no";
  if (options.letsencrypt !== undefined) params.letsencrypt = options.letsencrypt ? "yes" : "no";
  if (options.antispam !== undefined) params.antispam = options.antispam ? "yes" : "no";
  if (options.antivirus !== undefined) params.antivirus = options.antivirus ? "yes" : "no";

  const response = await hestiaRequest("/add/mail-domain", "POST", params);
  return response?.result === "OK";
}

/**
 * List DNS records for a domain
 */
export async function listDNSRecords(
  domain: string,
  user: string = "admin"
): Promise<DNSRecord[]> {
  const response = await hestiaRequest(`/list/dns/${domain}`);
  
  if (!response || response.result !== "OK" || !response.data) {
    return [];
  }

  const data = response.data as Record<string, DNSRecord>;
  return Object.values(data);
}

/**
 * Add a DNS record
 */
export async function addDNSRecord(
  domain: string,
  record: string,
  type: string,
  value: string,
  user: string = "admin",
  options: {
    priority?: number;
    ttl?: number;
  } = {}
): Promise<boolean> {
  const params: Record<string, string> = {
    domain,
    record,
    type,
    value,
    user,
  };

  if (options.priority) params.priority = String(options.priority);
  if (options.ttl) params.ttl = String(options.ttl);

  const response = await hestiaRequest("/add/dns-record", "POST", params);
  return response?.result === "OK";
}

/**
 * Delete a DNS record
 */
export async function deleteDNSRecord(
  domain: string,
  recordId: string,
  user: string = "admin"
): Promise<boolean> {
  const response = await hestiaRequest("/delete/dns-record", "POST", {
    domain,
    rid: recordId,
    user,
  });
  return response?.result === "OK";
}

/**
 * Get server sys tab info
 */
export async function getSystemInfo(): Promise<{
  hostname: string;
  os: string;
  uptime: number;
  load: number[];
  memory: { total: number; used: number; free: number };
  disk: { total: number; used: number; free: number };
} | null> {
  const response = await hestiaRequest("/list/system/info");
  
  if (!response || response.result !== "OK" || !response.data) {
    return null;
  }

  return response.data as any;
}

/**
 * Get user statistics
 */
export async function getUserStats(user: string = "admin"): Promise<{
  U_WEB_DOMAINS: number;
  U_DNS_RECORDS: number;
  U_MAIL_DOMAINS: number;
  U_DATABASES: number;
  U_CRONS: number;
  U_BACKUPS: number;
  DISK: number;
  BANDWIDTH: number;
} | null> {
  const response = await hestiaRequest(`/list/user/${user}/stats`);
  
  if (!response || response.result !== "OK" || !response.data) {
    return null;
  }

  return response.data as any;
}
