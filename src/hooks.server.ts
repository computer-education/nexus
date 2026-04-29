import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const supabaseUrl = env.PUBLIC_SUPABASE_URL;
	const supabaseKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	event.locals.supabase = createServerClient(supabaseUrl, supabaseKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/', secure: true, sameSite: 'lax' });
				});
			}
		}
	});

	const {
		data: { user },
		error
	} = await event.locals.supabase.auth.getUser();

	if (error) {
		console.error('🔍 Detail Error Supabase Auth:', error.message);
	}

	event.locals.session = user ? { user } : null;

	const path = event.url.pathname;
	const isAuthRoute =
		path.startsWith('/login') || path.startsWith('/join') || path.startsWith('/auth');

	if (!user && !isAuthRoute) {
		throw redirect(303, '/login');
	}

	if (user && path === '/login') {
		throw redirect(303, '/');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
