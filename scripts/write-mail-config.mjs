// Writes out/api/_mail-config.php for the static build, from the SMTP_PASSWORD
// environment variable (a GitHub secret in the deploy workflow). The password
// only ever exists in the uploaded copy, never in the repository.
//
//   SMTP_PASSWORD=... node scripts/write-mail-config.mjs

import { writeFileSync } from "node:fs";

const password = process.env.SMTP_PASSWORD;
if (!password) {
  console.log("SMTP_PASSWORD not set; no mail settings written.");
  process.exit(0);
}

// Single-quoted PHP string: only backslash and single quote need escaping.
const php = (value) => `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

writeFileSync(
  "out/api/_mail-config.php",
  `<?php\nreturn ['username' => ${php("info@oxygen-hospital.com")}, 'password' => ${php(password)}];\n`,
  { mode: 0o600 }
);
console.log("Wrote out/api/_mail-config.php");
