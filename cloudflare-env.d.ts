// Extend the CloudflareEnv interface to include our D1 database binding
interface CloudflareEnv {
  DB: D1Database;
}
