<script lang="ts">
	import type { GeoData } from '../../app';
	export let geoData: GeoData = {} as GeoData;
</script>

<table>
	{#if Object.keys(geoData).length > 0}
	<thead>
		<tr>
			<th>Geo Data:</th>
		</tr>
	</thead>
	<tbody>
		<tr>
		{#each Object.keys(geoData) as key}
			<td>
				{key.replace(/([A-Z])/g, ' $1')
				.replace(/^./, (str) => str.toUpperCase())}: {geoData[key]}
			</td>
		{/each}
		</tr>
	</tbody>
	{/if}
</table>

<style lang="scss">
	
</style>
