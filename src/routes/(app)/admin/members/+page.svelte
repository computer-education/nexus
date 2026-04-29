<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<div class="mb-6">
	<h1 class="text-2xl font-bold text-gray-900">Manajemen Anggota</h1>
	<p class="text-sm text-gray-500">
		Persetujuan pendaftaran dan kenaikan status kaderisasi UKM CE.
	</p>
</div>

{#if form?.error}
	<div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-600">
		{form.error}
	</div>
{/if}

<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm text-gray-600">
			<thead
				class="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 uppercase"
			>
				<tr>
					<th class="px-6 py-4">Nama Lengkap</th>
					<th class="px-6 py-4">NIM / Prodi</th>
					<th class="px-6 py-4">Status Saat Ini</th>
					<th class="px-6 py-4 text-right">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each data.members as member}
					<tr class="transition-colors hover:bg-gray-50">
						<td class="px-6 py-4 font-medium text-gray-900">{member.full_name ?? 'Tanpa Nama'}</td>
						<td class="px-6 py-4">
							<div class="text-gray-900">{member.nim ?? '-'}</div>
							<div class="text-xs text-gray-500">{member.prodi ?? '-'}</div>
						</td>
						<td class="px-6 py-4">
							{#if member.role === 'pending_approval'}
								<span
									class="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
								>
									Menunggu Verifikasi
								</span>
							{:else}
								<span
									class="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
								>
									Anggota Muda
								</span>
							{/if}
						</td>
						<td class="px-6 py-4 text-right">
							{#if member.role === 'pending_approval'}
								<form method="POST" action="?/setujui" use:enhance class="inline">
									<input type="hidden" name="id" value={member.id} />
									<button
										type="submit"
										class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
									>
										Setujui Jadi Anggota
									</button>
								</form>
							{:else if member.role === 'anggota_muda'}
								<form method="POST" action="?/naikPangkat" use:enhance class="inline">
									<input type="hidden" name="id" value={member.id} />
									<button
										type="submit"
										class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
									>
										Naik ke Anggota Biasa
									</button>
								</form>
							{/if}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="px-6 py-8 text-center text-gray-500">
							Tidak ada anggota yang perlu diproses saat ini.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
