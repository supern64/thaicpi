import { BASE_API_URL, type DataPoint } from "$lib/constants";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }): Promise<Response> => {
    const base = Number(url.searchParams.get("base"));
    const iniYear = Number(url.searchParams.get("iniYear"));
    const iniMonth = Number(url.searchParams.get("iniMonth"));
    const finYear = Number(url.searchParams.get("finYear"));
    const finMonth = Number(url.searchParams.get("finMonth"));
    const iniPrice = Number(url.searchParams.get("iniPrice"));

    if (!(base && iniYear && finYear && iniPrice && finYear && finMonth)) error(400, "base/initial/final year/price missing");
    if (isNaN(base) || isNaN(iniYear) || isNaN(finYear) || isNaN(iniPrice) || isNaN(finYear) || isNaN(finMonth)) error(400, "invalid base/initial/final year/price");

    const iniData = (await (await fetch(BASE_API_URL + "/Cpig/Month", {
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
    })).json())[0] as DataPoint;

    const finData = (await (await fetch(BASE_API_URL + "/Cpig/Month", {
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
    })).json())[0] as DataPoint;

    const finPrice = (finData.index/iniData.index * iniPrice).toFixed(2);
    const percentChange = ((finData.index - iniData.index) / iniData.index * 100).toFixed(2);

    return new Response(JSON.stringify({finPrice, percentChange, index: {ini: iniData.index, fin: finData.index}}))
}