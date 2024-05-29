<script lang="ts">
	import GeoDetails from "./GeoDetails.svelte";
  import type { GeoData, URLData } from "../../app.d";

  export let urlData: URLData;
  let geoData: GeoData = urlData.geoData;
</script>

<section>
  {#if Object.keys(urlData).length > 0}
  <h2>URL Data</h2>
  <dl>
    {#each Object.keys(urlData).filter(key => key !== 'geoData') as key}
      <dt>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</dt>
      <dd>
        {#if key === 'longUrl'}
          <a href={urlData[key]} target="_blank">{urlData[key]}</a>
        {:else if key === 'createdAt'}
          {new Date(urlData[key]).toLocaleString()}
        {:else}
          {urlData[key]}
        {/if}
      </dd>
    {/each}
  </dl>
  
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

  dl {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  dt {
    font-weight: bold;
  }

  dd {
    margin-left: 1rem;
  }
</style>
