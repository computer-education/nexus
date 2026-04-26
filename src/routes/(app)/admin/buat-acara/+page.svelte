<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// SVELTE 5: Menggunakan $state untuk form
	let title = $state('');
	let description = $state('');
	let dateTime = $state('');
	let isPublic = $state(false);
	let loading = $state(false);
	let userId = $state('');

	onMount(async () => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) return goto('/login');

		const { data: profile } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();
		if (profile?.role !== 'pengurus') {
			alert('Akses Ditolak: Hanya pengurus yang bisa membuat acara.');
			goto('/');
		}
		userId = user.id;
	});

	const handleSubmit = async () => {
		loading = true;
		const { error } = await supabase.from('events').insert({
			title: title,
			description: description,
			date_time: new Date(dateTime).toISOString(),
			is_public: isPublic,
			created_by: userId
		});
		loading = false;

		if (error) {
			alert('Gagal membuat acara: ' + error.message);
		} else {
			alert('Kajian berhasil dipublikasikan!');
			goto('/'); // Balik ke Dashboard
		}
	};
</script>

<div class="mx-auto max-w-2xl rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
	<h1 class="mb-6 text-2xl font-bold text-gray-800">Buat Jadwal Kajian / Event</h1>

	<form onsubmit={handleSubmit} class="space-y-5">
		<div>
			<label class="block text-sm font-medium text-gray-700">Nama Acara</label>
			<input
				type="text"
				bind:value={title}
				required
				class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500"
				placeholder="Contoh: Kajian Web Dev 101"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700">Deskripsi</label>
			<textarea
				bind:value={description}
				rows="3"
				class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500"
				placeholder="Materi yang akan dibahas..."
			></textarea>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700">Tanggal & Waktu</label>
			<input
				type="datetime-local"
				bind:value={dateTime}
				required
				class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500"
			/>
		</div>

		<div class="flex items-center gap-2">
			<input
				type="checkbox"
				id="isPublic"
				bind:checked={isPublic}
				class="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
			/>
			<label for="isPublic" class="text-sm text-gray-700">Buka untuk Umum (Guest bisa ikut)</label>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="w-full rounded-lg bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 disabled:bg-gray-400"
		>
			{loading ? 'Menyimpan...' : 'Publikasikan Acara'}
		</button>
	</form>
</div>
