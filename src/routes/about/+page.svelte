<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>About this app</h1>
	<h2>URL shortener with Svelte</h2>

	<h3>Details</h3>
	<ol>
		<li>Github repository</li>
		<li>The `task` branch of the repository is a working branch</li>
		<li>`adapter-cloudflare` to deploy to Cloudflare Pages</li>
		<li>Integrate Cloudflare Pages with GitHub repository</li>
		<li>Activate CI/CD for integration</li>
		<li>Enable pull requests from `task` to `master` branch</li>
		<li>Use Cloudflare Workers KV as storage backend</li>
		<li>Create Svelte `+server.ts` route for `/[shortUrl]`</li>
		<li>Use 302 redirect to the [shortUrl]</li>
		<li>
			Store the following data in KV:
			<ul>
				<li>Redirect time</li>
				<li>User Agent</li>
				<li>Geoip data provided by Cloudflare</li>
				<li>Client IP address</li>
			</ul>
		</li>
		<li>Create route `+page.svelte` for `/[shortUrl]/stats` page</li>
		<li>
			At `/[shortUrl]/stats` whow the following info
			<ul>
				<li>
					table with link open history with previously stored data (time, ip, user-agent, geoip)
				</li>
				<li>Total amount of link activated (redirected to)</li>
			</ul>
		</li>
		<li>Route `/list` to display all generated links</li>
	</ol>

	<h3>UI Requirements</h3>
	<ol>
		<li>Use Svelte Form Enhancements to create quality input form</li>
		<li>
			Input form contains text input for long URL input and `Submit` button. Use URL validation.
		</li>
		<li>Prevent double click/submission of long URL.</li>
		<li>Once long URL is submitted and short one was generated, replace button with short URL.</li>
		<li>Check for duplicate URL and issue an error if it exists.</li>
	</ol>

	<h3>Code Requirements</h3>
	<ol>
		<li>Minimal usage of 3rd-party libraries</li>
		<li>TypeScript in strict mode</li>
		<li>Maximal usage of Svelte (layouts, etc.)</li>
	</ol>
</div>
