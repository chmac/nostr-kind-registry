import { WORKER_URL } from '../../../shared/constants';
export const load = async () => {
	const response = await fetch(WORKER_URL);
	const json = await response.json();
	const kinds = json.kinds;
	console.log('kinds', kinds);
	return {
		kinds
	};
};
