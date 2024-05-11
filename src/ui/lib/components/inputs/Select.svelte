<script lang="ts">
	import FigmaIcon from '../figma-icons/FigmaIcon.svelte';
	import Label from './Label.svelte';

	let selectElement: HTMLSelectElement | undefined;

	/** @description attributes of the element */
	export let attributes: Record<string, string> = {};

	/** @description array of strings as the options */
	export let options: SelectItem[] = [];

	/** @description placeholder text */
	export let placeholder: SelectItem | undefined = {
		label: 'Select an option',
		value: '-',
		icon: '-',
	};

	/** @description value of the element */
	export let value: SelectItem = placeholder || options[0];

	export let tooltip: string | undefined = undefined;

	export const clear = () => {
		if (!selectElement) return;
		value = placeholder || options[0];
	};
</script>

<Label class="h-7 relative select-label" {tooltip} highlightOnFocus isSelect>
	<slot />
	<span
		class="absolute left-0 inset-y-0 translate-y-px grid place-content-center w-6 h-6 pl-1 leading-none pointer-events-none"
	>
		<FigmaIcon
			name={value?.icon ?? '-'}
			class="max-w-[16px]"
			size="sm"
			isLabelIcon
		/>
	</span>
	<select
		placeholder={placeholder?.label ?? undefined}
		{...attributes}
		class:w-full={true}
		class:input-text={true}
		class:is-placeholder={value === placeholder}
		on:change
		bind:value
		bind:this={selectElement}
	>
		{#if placeholder}
			<option value={placeholder} selected={placeholder.value === value.value}>
				{placeholder?.label ?? 'Select an option'}
			</option>
		{/if}
		{#each options as option (option)}
			<option value={option}>{option.label}</option>
		{/each}
	</select>
</Label>
