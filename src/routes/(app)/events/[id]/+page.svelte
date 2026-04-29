<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();

	let event = $derived(data.event);
	let isRegistered = $derived(data.isRegistered);
	let loading = $state(false);

	const formatTanggal = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<a
		href="/events"
		class="inline-flex items-center font-medium text-emerald-600 transition hover:text-emerald-700"
	>
		<span class="mr-2">&larr;</span> Kembali ke Katalog
	</a>

	{#if form?.message}
		<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
			{form.message}
		</div>
	{/if}

	<div class="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
		<div
			class="absolute top-0 right-0 z-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-emerald-50 blur-3xl"
		></div>

		<div class="relative z-10">
			<span
				class="mb-4 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold tracking-wider text-gray-700 uppercase"
			>
				{event.tipe_kegiatan.replace('_', ' ')}
			</span>

			<h1 class="mb-4 text-4xl leading-tight font-extrabold text-gray-900">
				{event.title}
			</h1>

			<div
				class="mb-8 flex inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-600"
			>
				<svg
					class="mr-2 h-5 w-5 text-emerald-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					></path></svg
				>
				<span class="font-medium">{formatTanggal(event.date_time)}</span>
			</div>

			<div class="mt-2 border-t border-gray-100 pt-6">
				{#if isRegistered}
					<div
						class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:flex-row"
					>
						<div class="flex items-center font-semibold text-emerald-800">
							<svg class="mr-2 h-6 w-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"
								><path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path></svg
							>
							Kamu sudah terdaftar di acara ini
						</div>

						<form
							method="POST"
							action="?/batal"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									loading = false;
									update();
								};
							}}
						>
							<button
								type="submit"
								disabled={loading}
								class="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
							>
								{loading ? 'Memproses...' : 'Batalkan Pendaftaran'}
							</button>
						</form>
					</div>
				{:else}
					<form
						method="POST"
						action="?/daftar"
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								loading = false;
								update();
							};
						}}
					>
						<button
							type="submit"
							disabled={loading}
							class="flex w-full items-center justify-center rounded-xl bg-gray-900 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-gray-800 disabled:opacity-50 sm:w-auto"
						>
							{loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>

	<div class="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
		<h2 class="mb-4 text-xl font-bold text-gray-900">Informasi Kegiatan</h2>
		<div class="prose prose-emerald max-w-none whitespace-pre-wrap text-gray-600">
			{event.description || 'Belum ada informasi tambahan untuk kegiatan ini.'}
		</div>
	</div>

	{#if data.userRole === 'pengurus'}
		<div class="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
			<div class="mb-6 flex items-end justify-between">
				<div>
					<h2 class="text-2xl font-bold text-gray-900">Daftar Peserta</h2>
				</div>
				<div
					class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"
				>
					Total: {data.participants.length} Pendaftar
				</div>
				{#if data.userRole === 'pengurus' && !event.is_closed}
					<form method="POST" action="?/tutupAcara" use:enhance>
						<button
							type="submit"
							class="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-black"
						>
							Selesaikan & Kunci Acara
						</button>
					</form>
				{/if}
			</div>

			<div class="overflow-x-auto rounded-xl border border-gray-100">
				<table class="w-full text-left text-sm text-gray-600">
					<thead
						class="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-700 uppercase"
					>
						<tr>
							<th class="px-6 py-4">No</th>
							<th class="px-6 py-4">Nama & Identitas</th>
							<th class="px-6 py-4">Waktu Daftar</th>
							<th class="px-6 py-4 text-center">Kehadiran</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each data.participants as p, index}
							<tr class="transition-colors hover:bg-gray-50/50">
								<td class="px-6 py-4 font-medium text-gray-400">{index + 1}</td>
								<td class="px-6 py-4">
									<div class="font-bold text-gray-900">{p.profiles?.full_name ?? 'Tanpa Nama'}</div>
									<div class="mt-0.5 text-xs text-gray-500">
										{p.profiles?.nim ?? '-'} • {p.profiles?.prodi ?? '-'}
									</div>
								</td>
								<td class="px-6 py-4 text-xs text-gray-500">
									{new Date(p.created_at).toLocaleTimeString('id-ID', {
										hour: '2-digit',
										minute: '2-digit'
									})} WIB
								</td>
								<td class="px-6 py-4 text-center">
									<form method="POST" action="?/toggleAbsen" use:enhance>
										<input type="hidden" name="registration_id" value={p.id} />
                                        <input type="hidden" name="user_id" value={p.profiles.id} />
										<input type="hidden" name="current_status" value={p.is_attended} />

										<button
											type="submit"
											class="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold transition-all
                                			{p.is_attended
												? 'border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
												: 'border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'}"
										>
											{#if p.is_attended}
												<svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20"
													><path
														fill-rule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clip-rule="evenodd"
													></path></svg
												>
												Hadir
											{:else}
												<div class="mr-2 h-2 w-2 rounded-full bg-gray-500"></div>
												Belum Hadir
											{/if}
										</button>
									</form>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="px-6 py-12 text-center text-gray-400">
									Belum ada anggota yang mendaftar.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
