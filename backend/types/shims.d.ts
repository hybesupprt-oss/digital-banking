declare module 'express-session' {
	import type { RequestHandler } from 'express'
	const session: any
	export = session
}

declare module 'connect-pg-simple' {
	function PgSession(options?: any): any
	export = PgSession
}

declare module 'drizzle-orm' {
	export type AnyQuery = any
	export function drizzle(...args: any[]): any
}
