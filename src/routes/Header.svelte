<script lang="ts">
	import { supabase } from '$lib/supabase';

	// SVELTE 5: Menerima props 'session' dan 'role' dari layout
	let { session = null, role = 'guest' } = $props();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.href = '/login';
	};
</script>

<header class="sticky top-0 z-50 border-b-2 border-emerald-500 bg-white shadow-sm">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<a href="/" class="flex items-center gap-2 transition-opacity hover:opacity-80">
			<span class="text-xl font-bold tracking-tight text-gray-800">
				Nexus <span class="text-emerald-600">CE</span>
			</span>
		</a>

		<nav class="flex items-center gap-6">
			{#if session}
				<a href="/" class="text-sm font-medium text-gray-600 hover:text-emerald-600">Beranda</a>
				<a href="/events" class="text-sm font-medium text-gray-600 hover:text-emerald-600"
					>Kegiatan</a
				>

				{#if role === 'anggota_biasa' || role === 'pengurus'}
					<a href="/kepanitiaan" class="text-sm font-medium text-gray-600 hover:text-emerald-600"
						>Kepanitiaan</a
					>
				{/if}

				{#if role === 'pengurus'}
					<a
						href="/admin/members"
						class="rounded-md bg-amber-50 px-3 py-1 text-sm font-bold text-amber-600 hover:text-amber-700"
					>
						Admin Panel
					</a>
				{/if}

				<div class="mx-2 h-5 w-px bg-gray-300"></div>
				<button
					onclick={handleLogout}
					class="text-sm font-medium text-red-500 transition-colors hover:text-red-700"
				>
					Keluar
				</button>
			{/if}
		</nav>
	</div>
</header>
