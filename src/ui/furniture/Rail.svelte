<script lang="ts">
	import { getContext } from 'svelte';
	import { MenuIcon, XIcon } from 'svelte-feather-icons';

	import Footer from '$ui/furniture/Footer.svelte';
	import isSvelteComponent from '$ui/lib/utils/isSvelteComponent';
	import isEmoji from '$ui/lib/utils/isEmoji';
	import FigmaIcon, {
		icons,
	} from '$ui/lib/components/figma-icons/FigmaIcon.svelte';

	const { tabs, tab } = getContext('App') as App;

	let menuToggle: HTMLInputElement;

	const closeMenu = () => {
		if (!menuToggle) return;
		menuToggle.checked = false;
	};

	const scrollToTop = () => {
		if (!document) return;
		document.getElementById('main')?.scrollTo({
			top: 0,
		});
	};

	$: $tab, scrollToTop();

	$: $tab, closeMenu();
</script>

<input
	id="menu-toggle"
	name="menu-toggle"
	title="Toggle menu"
	class="sr-only peer"
	type="checkbox"
	bind:this={menuToggle}
/>

<div
	id="rail"
	
>
	<label
		id="menu-toggle-label"
		for="menu-toggle"
	>
		<span id="menu-opened-icon"><XIcon size="16" /></span>
		<span id="menu-closed-icon"><MenuIcon size="16" /></span>
	</label>

	<header
		class="text-center px-3 py-3 sticky top-0 inset-x-0 border-b border-figma-color-border"
	>
		<img
			src="https://raw.githubusercontent.com/the-dataface/figma-plugin-svelte-vite/master/.github/assets/logo.png"
			height="32"
			class="h-8"
			alt="Svelte + Vite + TypeScript"
			role="heading"
			aria-level={1}
		/>
	</header>

	<nav
		aria-label="Settings and navigation panes"
		class="flex-1 overflow-y-auto bg-figma-color-bg z-40"
	>
		<ul class="flex flex-col">
			{#each tabs as component, i}
				{@const isActive = $tab === component.name}
				<li
					class="w-full border-b border-figma-color-border"
					aria-current={isActive ? 'true' : undefined}
				>
					<input
						class="sr-only peer"
						type="radio"
						name="tabs"
						id="tab-{i}"
						checked={i === 0}
						value={component.name}
						bind:group={$tab}
					/>
					<label
						class="flex gap-x-1.5 flex-nowrap items-center w-full p-3 cursor-pointer font-bold peer-focus:bg-figma-color-bg-hover peer-hover:bg-figma-color-bg-hover peer-checked:!bg-figma-color-bg-secondary {isActive
							? 'text-figma-color-text'
							: 'text-figma-color-text-secondary'}"
						for="tab-{i}"
					>
						{#if component.icon}
							<span
								class="min-w-[32px] min-h-[32px] grid place-content-center text-lg leading-none"
							>
								{#if icons.has(component.icon)}
									<FigmaIcon name={component.icon} />
								{:else if isSvelteComponent(component.icon)}
									<svelte:component this={component.icon} />
								{:else if isEmoji(component.icon)}
									<span>{@html component.icon}</span>
								{/if}
							</span>
						{/if}
						<span>
							{component.name}
						</span>
					</label>
				</li>
			{/each}
		</ul>
	</nav>

	<Footer />
</div>
