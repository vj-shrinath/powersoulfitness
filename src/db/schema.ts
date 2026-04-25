import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
});

export const contents = sqliteTable('contents', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  type: text('type').notNull().default('text'), // 'text', 'image'
});
