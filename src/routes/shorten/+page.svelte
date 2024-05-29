<script lang="ts">
	import '@picocss/pico';
	import InputForm from '../components/InputForm.svelte';
	import UrlDetails from '../components/UrlDetails.svelte';
	import type { URLData } from '../../app.d';

	let urlData: URLData;
	let formError = '';
</script>

<section class="form url-form">
	<h2>Enter long URL</h2>
	{#if formError}
		<p class="error">{formError}</p>
	{/if}
	<InputForm
		on:urlShortened={(e) => (urlData = e.detail.urlData)}
		on:formError={(e) => (formError = e.detail.formError)}
	/>
</section>

{#if urlData && Object.keys(urlData).length > 0}
	<section>
		<UrlDetails {urlData} />
	</section>
{/if}

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		flex: 0.4;
	}

	.url-form {
		h2,
		p {
			text-align: center;
		}
	}
</style>
