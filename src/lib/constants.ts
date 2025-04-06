export const BASE_API_URL = "https://index-api.tpso.go.th/OpenApi"

export interface AvailablePeriod {
    periodType: "month", // the api we use doesn't return anything other than this, きっと大丈夫だよね？
    yearBase: number,
    startPeriod: number,
    startYear: number,
    endPeriod: number,
    endYear: number
}

export interface DataPoint {
    type: string,
    typeName: string,
    commodityCode: string,
    commodityNameTH: string,
    month: number,
    year: number,
    yearBase: number,
    index: number,
    change: number,
    changeYear: number,
    changeAVG: number,
    level: number,
    createdAt: number
}

export const MONTH_NAMES = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]