<script lang="ts">
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation'; // Untuk fungsi redirect
	import { onMount } from 'svelte';

	let nim = '';
	let prodi = '';
	let whatsapp = '';
	let loading = false;
	let user: any = null;

	onMount(async () => {
		const { data } = await supabase.auth.getUser();
		user = data.user;

		if (!user) {
			goto('/'); // Kalau belum login, tendang ke halaman depan
		}
	});

	const handleSubmit = async () => {
		loading = true;

		// Update baris profil milik user ini
		const { error } = await supabase
			.from('profiles')
			.update({
				nim: nim,
				prodi: prodi,
				whatsapp: whatsapp,
				role: 'pending_approval'
			})
			.eq('id', user.id);

		loading = false;

		if (error) {
			alert('Waduh, gagal mendaftar: ' + error.message);
		} else {
			alert('Mantap! Pendaftaran berhasil dikirim. Menunggu persetujuan admin.');
			goto('/dashboard'); // Balikkan ke dashboard
		}
	};
</script>

<div class="mx-auto mt-10 max-w-2xl rounded-xl border border-emerald-100 bg-white p-8 shadow-sm">
	<div class="mb-8 border-b border-gray-100 pb-4">
		<h1 class="text-3xl font-bold text-gray-800">Daftar Anggota UKM CE</h1>
		<p class="mt-2 text-gray-500">
			Lengkapi data diri kamu di bawah ini untuk bergabung menjadi anggota resmi.
		</p>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div>
			<label for="nim" class="mb-1 block text-sm font-medium text-gray-700"
				>NIM (Nomor Induk Mahasiswa)</label
			>
			<input
				type="text"
				id="nim"
				bind:value={nim}
				required
				class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
				placeholder="Contoh: 210xxxxxx"
			/>
		</div>

		<div>
			<label for="prodi" class="mb-1 block text-sm font-medium text-gray-700">Program Studi</label>
			<select
				id="prodi"
				bind:value={prodi}
				required
				class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
			>
				<option value="" disabled selected>Pilih Program Studi...</option>
				<option value="Teknik Informatika">Teknik Informatika</option>
				<option value="Sistem Informasi">Sistem Informasi</option>
				<option value="Ilmu Komunikasi">Ilmu Komunikasi</option>
			</select>
		</div>

		<div>
			<label for="whatsapp" class="mb-1 block text-sm font-medium text-gray-700"
				>Nomor WhatsApp</label
			>
			<input
				type="tel"
				id="whatsapp"
				bind:value={whatsapp}
				required
				class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
				placeholder="Contoh: 081234567890"
			/>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="flex w-full cursor-pointer justify-center rounded-lg border border-transparent bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none disabled:bg-gray-400"
		>
			{#if loading}
				<svg
					class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Menyimpan Data...
			{:else}
				Kirim Pendaftaran
			{/if}
		</button>
	</form>
</div>
