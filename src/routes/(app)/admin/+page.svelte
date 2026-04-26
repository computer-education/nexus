<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';

	let pendaftar: any[] = [];
	let loading = true;

	const fetchPendaftar = async () => {
		loading = true;
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('role', 'pending_approval')
			.order('updated_at', { ascending: false });

		if (!error) pendaftar = data;
		loading = false;
	};

	const terimaAnggota = async (id: string) => {
		const { error } = await supabase.from('profiles').update({ role: 'anggota_muda' }).eq('id', id);

		if (!error) {
			fetchPendaftar();
		} else {
			alert('Gagal mengupdate: ' + error.message);
		}
	};

	onMount(async () => {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			goto('/');
			return;
		}

		const { data: profile } = await supabase
			.from('profiles')
			.select('role')
			.eq('id', user.id)
			.single();

		if (profile?.role !== 'pengurus') {
			alert('Akses Ditolak: Halaman ini khusus Pengurus UKM CE!');
			goto('/');
			return;
		}

		fetchPendaftar();
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-800">Manajemen Pendaftaran Anggota</h1>
		<button on:click={fetchPendaftar} class="text-sm text-emerald-600 hover:underline"
			>Refresh Data</button
		>
	</div>

	{#if loading}
		<p>Memuat data pendaftar...</p>
	{:else if pendaftar.length === 0}
		<div class="rounded-xl border-2 border-dashed bg-gray-100 p-10 text-center text-gray-500">
			Tidak ada pendaftaran baru saat ini.
		</div>
	{:else}
		<div class="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
			<table class="w-full text-left">
				<thead class="border-b border-gray-100 bg-gray-50">
					<tr>
						<th class="px-6 py-4 text-sm font-semibold text-gray-700">Nama</th>
						<th class="px-6 py-4 text-sm font-semibold text-gray-700">NIM / Prodi</th>
						<th class="px-6 py-4 text-sm font-semibold text-gray-700">WhatsApp</th>
						<th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-50">
					{#each pendaftar as p}
						<tr class="transition-colors hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="font-medium text-gray-900">{p.full_name}</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-600">{p.nim}</div>
								<div class="text-xs text-gray-400">{p.prodi}</div>
							</td>
							<td class="px-6 py-4 text-sm text-gray-600">
								{p.whatsapp}
							</td>
							<td class="px-6 py-4 text-right">
								<button
									on:click={() => terimaAnggota(p.id)}
									class="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-200"
								>
									Terima
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
