const API = 'https://nkr.erudo.workers.dev';

export const load = async () => {
	const response = await fetch(API);
	const json = await response.json();
	const kinds = json.kinds;
	console.log('kinds', kinds);
	return {
		kinds
	};
};
