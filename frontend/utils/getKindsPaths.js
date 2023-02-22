import fetch from 'node-fetch';
import { REPO_PUBLIC_URL } from '../src/constants.js';

// NOTE: As this file is loaded from `svelte.config.js` it cannot use
// TypeScript, and so we cannot reuse code from the app here.
export const getKindsPaths = async () => {
	const kindsListResponse = await fetch(`${REPO_PUBLIC_URL}/kinds/kindsList.txt`);
	const kindsListText = await kindsListResponse.text();
	const kindsPaths = kindsListText
		.trim()
		.split('\n')
		.map((line) => line.split(',')[0])
		.map((kind) => `/kinds/${kind}/`);

	return kindsPaths;
};
