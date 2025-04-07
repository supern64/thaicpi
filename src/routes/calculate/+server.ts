import { BASE_API_URL, type DataPoint } from "$lib/constants";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

let cache: {[key: number]: number} = {}

function ym2ID(year: number, month: number): number {
    return (year - 2519) * 12 + (month - 1);
}

export const GET: RequestHandler = async ({ url }): Promise<Response> => {
    const base = Number(url.searchParams.get("base"));
    const iniYear = Number(url.searchParams.get("iniYear"));
    const iniMonth = Number(url.searchParams.get("iniMonth"));
    const finYear = Number(url.searchParams.get("finYear"));
    const finMonth = Number(url.searchParams.get("finMonth"));
    const iniPrice = Number(url.searchParams.get("iniPrice"));

    if (!(base && iniYear && finYear && iniPrice && finYear && finMonth)) error(400, "base/initial/final year/price missing");
    if (isNaN(base) || isNaN(iniYear) || isNaN(finYear) || isNaN(iniPrice) || isNaN(finYear) || isNaN(finMonth)) error(400, "invalid base/initial/final year/price");

    let iniIndex, finIndex;
    if (cache[ym2ID(iniYear, iniMonth)]) {
        iniIndex = cache[ym2ID(iniYear, iniMonth)];
    } else {
        const iniReq = await fetch(BASE_API_URL + "/Cpig/Month", {
            method: "POST",
            body: JSON.stringify({
                yearBase: base,
                month: iniMonth,
                year: iniYear,
                type: "TG", // all country
                commodities: ["00000"] // all categories
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!iniReq.ok) error(500, "error in api fetching");
        const iniData = (await iniReq.json())[0] as DataPoint;
        cache[ym2ID(iniYear, iniMonth)] = iniData.index;
        iniIndex = iniData.index;
    }

    if (cache[ym2ID(finYear, finMonth)]) {
        finIndex = cache[ym2ID(finYear, finMonth)];
    } else {
        const finReq = await fetch(BASE_API_URL + "/Cpig/Month", {
            method: "POST",
            body: JSON.stringify({
                yearBase: base,
                month: finMonth,
                year: finYear,
                type: "TG", // all country
                commodities: ["00000"] // all categories
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!finReq.ok) error(500, "error in api fetching");
        const finData = (await finReq.json())[0] as DataPoint;
        cache[ym2ID(finYear, finMonth)] = finData.index;
        finIndex = finData.index;
    }

    const finPrice = (finIndex/iniIndex * iniPrice).toFixed(2);
    const percentChange = ((finIndex - iniIndex) / iniIndex * 100).toFixed(2);

    return new Response(JSON.stringify({finPrice, percentChange, index: {ini: iniIndex, fin: finIndex}}))
}