# Making Hosting Fully Functional - Implementation Guide

Your Illusionhost website has two hosting components that need external systems to work:

---

## 1. HestiaCP (Web Hosting Control Panel)

**What it does:** Manages web domains, databases, email accounts, and DNS records.

### Step 1: Install HestiaCP on a server

```bash
# On a fresh Ubuntu 22.04 LTS server:
curl -O https://hestiacp/install.sh
sudo bash install.sh
```

During installation:
- Set admin password
- Choose web server (Nginx + Apache or Nginx only)
- Enable MySQL/MariaDB

### Step 2: Enable API Access

After installation:
1. Login to HestiaCP at `https://your-server-ip:8083`
2. Go to **IP Management > API**
3. Enable API
4. Add your app's server IP to allowed IPs

### Step 3: Generate API Key

1. Go to **User Settings > API Keys**
2. Create new API key
3. Copy the key

### Step 4: Add Environment Variables

Add to your `.env.local` file:

```env
HESTIA_HOST=https://your-hestia-server-ip:8083
HESTIA_API_KEY=your-generated-api-key
HESTIA_ADMIN_USER=admin
```

---

## 2. Proxmox VE (VPS Containers)

**What it does:** Provides VPS/container provisioning for customers.

### Step 1: Install Proxmox VE

Install Proxmox VE on a dedicated server using the official ISO.

### Step 2: Create API Token

1. Login to Proxmox web interface
2. Go to **Datacenter > Permissions > API Tokens**
3. Click **Add**
4. Select user `root@pam`
5. Give it a name (e.g., "illusionhost")
6. Enable **Privilege Separation**
7. Copy the Token ID and Secret

### Step 3: Set Permissions

1. Go to **Datacenter > Permissions > Roles**
2. Create a new role called `PVEAutoApi`
3. Add these permissions:
   - `PVEAutomation.Audit`
   - `PVEAutomation.Use`
   - `Sys.Audit`
   - `Sys.Console`
   - `Sys.Modify`
   - `VM.Audit`
   - `VM.Console`
   - `VM.Modify`
   - `VM.PowerMgmt`

4. Go to **Permissions** and add:
   - User: `root@pam`
   - Path: `/`
   - Role: `PVEAutoApi`
   - Token: your-token-id

### Step 4: Update lxc.ts

Replace the mock implementation in `src/lib/lxc.ts` with real Proxmox API calls.

### Step 5: Add Environment Variables

```env
PROXMOX_HOST=https://your-proxmox-ip:8006
PROXMOX_USER=root@pam
PROXMOX_TOKEN_ID=your-token-id
PROXMOX_TOKEN_SECRET=your-token-secret
```

---

## Quick Reference: Environment Variables Needed

| Variable | Description | Example |
|----------|-------------|---------|
| `HESTIA_HOST` | HestiaCP server URL | `https://192.168.1.100:8083` |
| `HESTIA_API_KEY` | HestiaCP API key | `your-api-key` |
| `HESTIA_ADMIN_USER` | Hestia admin username | `admin` |
| `PROXMOX_HOST` | Proxmox server URL | `https://192.168.1.200:8006` |
| `PROXMOX_USER` | Proxmox API user | `root@pam` |
| `PROXMOX_TOKEN_ID` | Proxmox token ID | `illusionhost@pam!illusionhost` |
| `PROXMOX_TOKEN_SECRET` | Proxmox token secret | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |

---

## Testing

After configuration, test with:

```bash
# Check HestiaCP connection
curl -k -H "API-Key: your-api-key" https://your-hestia-host:8083/api/v1/list/user/admin/

# Check Proxmox connection
curl -k -H "Authorization: PVEAPITokenID=token!token=secret" https://your-proxmox-host:8006/api2/json/nodes
```

---

## Summary

| Component | Server Required | Install Time |
|-----------|----------------|--------------|
| HestiaCP | Ubuntu 22.04 VPS | ~10 minutes |
| Proxmox | Dedicated server | ~15 minutes |

Both systems can run on the same server if it has enough resources, or on separate servers for better isolation.
