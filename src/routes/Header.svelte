<script lang="ts">
	import { supabase } from '$lib/supabase';

	const { session } = $props();

	const handleLogOut = async () => {
		await supabase.auth.signOut();
		window.location.href = '/';
	};
</script>

<header class="sticky top-0 z-50 border-b-2 border-emerald-500 bg-white shadow-sm">
	<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
		<div class="flex items-center gap-2">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 font-bold text-white"
			>
				C
			</div>
			<span class="text-xl font-bold tracking-tight text-gray-800">
				UKM <span class="text-emerald-600">Computer Education</span>
			</span>
		</div>

		<nav class="flex items-center gap-4">
			{#if session}
				<span class="hidden text-sm text-gray-600 sm:inline">
					Halo, <span class="font-semibold">{session.user.user_metadata.full_name}</span>
				</span>
				<button
					onclick={handleLogOut}
					class="rounded-md bg-red-500 px-5 py-2 text-sm font-medium transition-colors hover:bg-red-700"
				>
					Keluar
				</button>
			{/if}
		</nav>
	</div>
</header>
