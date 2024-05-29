<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { URLData } from '../../app.d';

  let longUrl = '';
  let shortUrl = '';
  export let formError = '';
  let isSubmitting = false;
  let urlData: URLData = undefined;
  const dispatch = createEventDispatcher();

  const handleSubmit = async () => {
    formError = '';
    isSubmitting = true;
    try {
      const response = await fetch('/api/kv/shorten', {
        method: 'POST',
        body: JSON.stringify({ url: longUrl }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }
      const data = await response.json();
      urlData = data.urlData;
      dispatch('urlShortened', { urlData });
    } catch (error) {
      formError = (error as Error).message;
      dispatch('formError', { formError });
    } finally {
      isSubmitting = false;
    }
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input type="url" bind:value={longUrl} required />
  {#if !urlData}
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  {:else}
    <p>Click short URL&nbsp;-&gt;
      <a target="_blank" href="/{urlData.shortUrl}">
        {document.location.protocol}://{document.location.host}/{urlData.shortUrl}
      </a>
    </p>
  {/if}
</form>
