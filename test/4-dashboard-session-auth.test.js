import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(new URL("../src/server.js", import.meta.url), "utf8");

test("dashboard Basic login creates a signed 30-day secure session cookie", () => {
  assert.match(source, /createHmac\("sha256", SETUP_PASSWORD\)/);
  assert.match(source, /const DASHBOARD_SESSION_TTL_SECONDS = 30 \* 24 \* 60 \* 60/);
  assert.match(source, /Max-Age=\$\{DASHBOARD_SESSION_TTL_SECONDS\}; Path=\/; HttpOnly; Secure; SameSite=Lax/);
  assert.match(source, /if \(hasValidDashboardSession\(req\)\) return next\(\)/);
  assert.match(source, /setDashboardSessionCookie\(res\);\s*return next\(\);/);
});

test("gateway Bearer injection remains enabled for proxied HTTP and WebSocket traffic", () => {
  assert.match(source, /req\.headers\.authorization = `Bearer \$\{OPENCLAW_GATEWAY_TOKEN\}`/);
  assert.match(source, /proxy\.on\("proxyReqWs"/);
  assert.ok(source.match(/attachGatewayAuthHeader\(req\)/g).length >= 3);
});
