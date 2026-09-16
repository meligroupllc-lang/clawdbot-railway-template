import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const src = fs.readFileSync(new URL("../src/server.js", import.meta.url), "utf8");

test("Odoo hook bridge requires an exact secret path and injects the hook token", () => {
  assert.match(src, /app\.post\("\/odoo-approved\/:secret"/);
  assert.match(src, /req\.params\.secret !== ODOO_HOOK_PATH_SECRET/);
  assert.match(src, /req\.headers\.authorization = `Bearer \$\{OPENCLAW_HOOK_TOKEN\}`/);
  assert.match(src, /req\.url = "\/hooks\/agent"/);
});

test("generic hooks preserve their own Authorization header", () => {
  assert.match(src, /if \(req\.url\?\.startsWith\("\/hooks"\)\) return;/);
});
