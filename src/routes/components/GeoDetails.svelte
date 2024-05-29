<script lang="ts">
	import type { GeoData } from '../../app';
	export let geoData: GeoData = {} as GeoData;
</script>

<dl>
	{#if Object.keys(geoData).length > 0}
		<dt>Geo Data:</dt>
		<dd>
			<ul>
				{#each Object.keys(geoData) as key}
					<li>
						{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}: {geoData[
							key
						]}
					</li>
				{/each}
			</ul>
		</dd>
	{/if}
</dl>

<style lang="scss">
	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin-left: 1rem;
	}
</style>
