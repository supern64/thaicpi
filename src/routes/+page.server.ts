import { BASE_API_URL, type AvailablePeriod } from '$lib/constants.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    const availableData = await (await fetch(BASE_API_URL + "/Cpig/Month/MasterData")).json();
    return {period: availableData.dataAvailablePeriods[0] as AvailablePeriod};
}