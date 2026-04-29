<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();

	let loading = $state(false);
</script>

<div class="mx-auto max-w-2xl">
	<div class="mb-8">
		<a href="/events" class="text-sm font-medium text-emerald-600 hover:underline"
			>&larr; Kembali ke Daftar</a
		>
		<h1 class="mt-2 text-3xl font-bold text-gray-900">Buat Kegiatan Baru</h1>
		<p class="text-gray-500">Isi detail kegiatan untuk dipublikasikan ke seluruh anggota.</p>
	</div>

	{#if form?.error}
		<div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
			{form.error}
		</div>
	{/if}

	<div class="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					update();
				};
			}}
			class="space-y-6"
		>
			<div>
				<label for="title" class="mb-1 block text-sm font-semibold text-gray-700"
					>Judul Kegiatan</label
				>
				<input
					type="text"
					id="title"
					name="title"
					required
					class="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-emerald-500"
					placeholder="Contoh: Kajian Rutin Mingguan"
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div>
					<label for="type" class="mb-1 block text-sm font-semibold text-gray-700"
						>Tipe Kegiatan</label
					>
					<select
						id="type"
						name="type"
						required
						class="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-emerald-500"
					>
						<option value="" disabled selected>Pilih Tipe</option>
						<option value="kajian">Kajian</option>
						<option value="rapat_pleno">Rapat Pleno</option>
						<option value="rapat_panitia">Rapat Panitia</option>
						<option value="pelatihan">Pelatihan / Workshop</option>
						<option value="umum">Umum / Lainnya</option>
					</select>
				</div>

				<div>
					<label for="date_time" class="mb-1 block text-sm font-semibold text-gray-700"
						>Waktu Pelaksanaan</label
					>
					<input
						type="datetime-local"
						id="date_time"
						name="date_time"
						required
						class="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-emerald-500"
					/>
				</div>
			</div>

			<div>
				<label for="description" class="mb-1 block text-sm font-semibold text-gray-700"
					>Deskripsi / Detail</label
				>
				<textarea
					id="description"
					name="description"
					rows="4"
					class="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-emerald-500"
					placeholder="Tuliskan detail acara, lokasi, atau persyaratan..."
				></textarea>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 disabled:opacity-50"
			>
				{loading ? 'Memproses...' : 'Publikasikan Acara'}
			</button>
		</form>
	</div>
</div>
