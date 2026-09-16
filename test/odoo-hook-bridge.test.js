import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const src = fs.readFileSync(new URL("../src/server.js", import.meta.url), "utf8");

test("Odoo hook bridge requires an exact secret path and injects the hook token", () => {
  assert.match(src, /app\.post\("\/odoo-approved\/:secret"/);
  assert.match(src, /req\.params\.secret !== ODOO_HOOK_PATH_SECRET/);
  assert.match(src, /req\.headers\.authorization = `Bearer \$\{OPENCLAW_HOOK_TOKEN\}`/);
  assert.match(src, /req\.url = "\/hooks\/agent"/);
  assert.match(src, /name: "Odoo Approved",\n    agentId: "odoo-assistant"/);
});

test("generic hooks preserve their own Authorization header", () => {
  assert.match(src, /if \(req\.url\?\.startsWith\("\/hooks"\)\) return;/);
});


test("Discuss webhook bridge uses its own secret and targets odoo-assistant", () => {
  assert.match(src, /app\.post\("\/odoo-discuss\/:secret"/);
  assert.match(src, /req\.params\.secret !== ODOO_DISCUSS_HOOK_PATH_SECRET/);
  assert.match(src, /agentId: "odoo-assistant"/);
  assert.match(src, /Reply in the same Odoo thread as slinqy_agents/);
});
