/**
 * @fileoverview This is the entry point for your plugin.
 * @see {@link https://www.figma.com/plugin-docs/|Figma Plugin Docs}
 */
import { createVariableHandler, isFrame } from './lib/variables'
import { findClosestNumberIndex } from './lib/utils';
import { findClosestColorIndex } from './lib/colors';
import type { TidyVariableFields } from './lib/variables';
// Determine if the plugin is running in a design file or a figjam file
const isFigma = figma.editorType === 'figma';
const isFigjam = figma.editorType === 'figjam';

const figmaPostMessage = (message: MessageDataFromPlugin) => {
	figma.ui.postMessage(message);
	return;
};

/**
 * RECOMMENDED: ignore invisible nodes. speeds up document traversal
 * @see {@link https://www.figma.com/plugin-docs/api/properties/figma-skipinvisibleinstancechildren/|figma.skipInvisibleInstanceChildren}
 */
figma.skipInvisibleInstanceChildren = true;

/**
 * Enables you to render UI to interact with the user, or simply to access browser APIs. This function creates a modal dialog with an <iframe> containing the HTML markup in the html argument.
 * @see {@link https://www.figma.com/plugin-docs/api/properties/figma-showui/|figma.showUI}
 */
figma.showUI(__html__, { width: 560, height: 500, themeColors: true });

// plugin initialized
figmaPostMessage({ type: 'init' });

const gapProperties = [
	'itemSpacing',
	'paddingBottom',
	'paddingLeft',
	'paddingRight',
	'paddingTop'
] as TidyVariableFields[];

const gapHandler = createVariableHandler(['GAP'], findClosestNumberIndex);

const colorProperties = ['fills'] as TidyVariableFields[]
const colorHandler = createVariableHandler(['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR', 'EFFECT_COLOR'], findClosestColorIndex)

// message handle
figma.ui.onmessage = async (message: MessageDataFromUI) => {
	if (!message.type) return;

	switch (message.type) {
		// use figma's built-in notification system
		// https://www.figma.com/plugin-docs/api/properties/figma-notify/
		case 'notify': {
			const { type, notification, options } = message;
			return figma.notify(notification as string, options);
		}

		case 'tidy': {
			console.log("tiding")
			figmaPostMessage({ type: 'tidy-start' });
			const selectedNodes = figma.currentPage.selection;
			const allSelectedNodesWithChildren = [...selectedNodes]
			selectedNodes.forEach(node => {
				if (isFrame(node)) {
					const newNodes =  node.findAll() as SceneNode[]
					allSelectedNodesWithChildren.push(...newNodes)
				}
			})

			allSelectedNodesWithChildren.forEach(node => {
				gapHandler.bindVariables(node, gapProperties);
				colorHandler.bindVariables(node, colorProperties)
			})

			figmaPostMessage({ type: 'tidy-complete' });
			console.log("tidy done")

		}
	}
};

