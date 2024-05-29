<script lang="ts">
	import GeoDetails from './GeoDetails.svelte';
	import type { GeoData, URLData } from '../../app.d';

	export let urlData: URLData;
	let geoData: GeoData = urlData.geoData;
</script>

<section>
	{#if Object.keys(urlData).length > 0}
		<table>
			<thead>
				<th>
					<h2>URL Data</h2>
				</th>
			</thead>
			<tbody>
				{#each Object.keys(urlData).filter((key) => key !== 'geoData' && key !== 'urlHash') as key}
				<tr>
					<td>
						{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
					</td>
					<td>
						{#if key === 'longUrl'}
							<a href={urlData[key]} target="_blank">{urlData[key]}</a>
						{:else if key === 'shortUrl'}
							<a href={urlData[key]} target="_blank">{document.location.protocol}://{document.location.host}/{urlData.shortUrl}</a>
						{:else if key === 'createdAt'}
							{new Date(urlData[key]).toLocaleString()}
						{:else}
							{urlData[key]}
						{/if}
					</td>
				</tr>
			{/each}
			</tbody>
		</table>

		<GeoDetails {geoData} />
	{/if}
</section>

<style lang="scss">
	section {
		padding: 1rem;
	}

	h2 {
		text-align: center;
	}
</style>
