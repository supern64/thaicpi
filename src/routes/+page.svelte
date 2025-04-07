<svelte:head>
    <meta name="title" content="เครื่องคำนวณเงินเฟ้อไทย">
    <meta name="description" content="คำนวณเงินเฟ้อและมูลค่าของสิ่งของในประเทศไทยรายเดือน ตามข้อมูล CPI">
    <meta name="keywords" content="เงิน,เงินเฟ้อ,CPI,ไทย,ค่าครองชีพ,มูลค่า">
    <meta name="robots" content="index, follow">
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="language" content="Thai">

    <meta property="og:type" content="website">
    <meta property="og:title" content="เครื่องคำนวณเงินเฟ้อไทย">
    <meta property="og:url" content="https://thaicpi.cirnoslab.me">
    <meta property="og:image" content="https://thaicpi.cirnoslab.me/logo.png">
    <meta property="og:description" content="คำนวณเงินเฟ้อและมูลค่าของสิ่งของในประเทศไทยรายเดือน ตามข้อมูล CPI">

    <meta property="twitter:card" content="summary" />
    <meta property="twitter:url" content="https://thaicpi.cirnoslab.me" />
    <meta property="twitter:title" content="เครื่องคำนวณเงินเฟ้อไทย" />
    <meta property="twitter:description" content="คำนวณเงินเฟ้อและมูลค่าของสิ่งของในประเทศไทยรายเดือน ตามข้อมูล CPI" />
    <meta property="twitter:image" content="https://thaicpi.cirnoslab.me/logo.png" />
    
    <title>เครื่องคำนวณเงินเฟ้อไทย</title>
</svelte:head>
<script lang="ts">
    import {  MONTH_NAMES, type AvailablePeriod } from "$lib/constants";

    /** @type {import('./$types').PageData} */
    export let data;
    export const availableData = data.period as AvailablePeriod;

    let chosenIniYear = 2550;
    let chosenIniMonth = 0;
    let iniPrice = 100;

    let chosenFinYear = availableData.endYear;
    let chosenFinMonth = availableData.endPeriod - 1;
    let finPrice: number;

    let percentChange: number;
    let calculating = false;
    let error = "";


    async function calculate() {
        if (iniPrice < 0.01) {
            error = "จำนวณเงินต้องมีอย่างน้อย 0.01 บาท"
            return;
        }

        calculating = true;
        error = ""
        try {
            const finReq = await fetch(
                "/calculate?" + new URLSearchParams({
                    base: availableData.yearBase.toString(),
                    iniYear: chosenIniYear.toString(),
                    iniMonth: (chosenIniMonth + 1).toString(),
                    finYear: chosenFinYear.toString(),
                    finMonth: (chosenFinMonth + 1).toString(),
                    iniPrice: iniPrice.toString()
            }).toString());
            
            if (!finReq.ok) {
                error = "ไม่สามารถคำนวณข้อมูลได้ กรุณาลองอีกครั้ง";
                calculating = false;
                return;
            }

            const finData = await finReq.json();

            finPrice = finData.finPrice;
            percentChange = finData.percentChange;
            calculating = false;
        } catch (e) {
            calculating = false;
            error = "ไม่สามารถคำนวณข้อมูลได้ กรุณาลองอีกครั้ง"
            console.error(e)
        }
    }
</script>
<div class="flex justify-center items-center h-[100vh] max-sm:h-[90vh] p-4">
    <div class="bg-gray-800 text-xl max-sm:text-[1.1rem] max-w-4xl m-auto p-4 max-sm:p-2 text-center border-2 rounded-sm">
        <h1 class="text-3xl font-bold">คำนวณเงินเฟ้อไทย</h1>
        (โดยคำนวณจากค่า CPI)
        <div class="italic p-4">
            <div class="flex gap-4 mb-2 max-sm:mb-6 max-sm:justify-center flex-wrap">
                <div class="grow-0 justify-end">
                    หากซื้อสินค้าราคา
                    <input type="number" min="0.01" bind:value={iniPrice} id="iniPrice" class="textbox w-[8rem] max-sm:w-[6rem] not-italic" placeholder="ราคาปีนั้น">
                    บาท
                </div>
                <div class="grow-0">
                    ในเดือน
                    <select id="iniMonth" class="textbox not-italic w-[8rem]" bind:value={chosenIniMonth}>
                        {#each { length: (chosenIniYear === availableData.endYear) ? availableData.endPeriod : 12 }, month}
                            <option value={month}>{MONTH_NAMES[month]}</option>
                        {/each}
                    </select>
                    <select id="iniYear" class="textbox not-italic w-[5rem]" bind:value={chosenIniYear}>
                        {#each { length: availableData.endYear - availableData.startYear + 1 }, yearOffset}
                            <option value={availableData.startYear + yearOffset}>{availableData.startYear + yearOffset}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="flex gap-4 min-md:justify-end max-sm:mb-4 max-sm:justify-center flex-wrap">
                <div class="grow-0 justify-end">
                    จะต้องใช้เงิน
                    <input type="text" bind:value={finPrice} id="finPrice" class="textbox w-[8rem] not-italic placeholder:text-gray-600" disabled placeholder="ราคาปีนี้">
                    บาท
                </div>
                <div class="grow-0">
                    ในเดือน
                    <select id="finMonth" class="textbox not-italic w-[8rem]" bind:value={chosenFinMonth}>
                        {#each { length: (chosenFinYear === availableData.endYear) ? availableData.endPeriod : 12 }, month}
                            <option value={month}>{MONTH_NAMES[month]}</option>
                        {/each}
                    </select>
                    <select id="finYear" class="textbox not-italic w-[5rem]" bind:value={chosenFinYear}>
                        {#each { length: availableData.endYear - availableData.startYear + 1 }, yearOffset}
                            <option value={availableData.startYear + yearOffset}>{availableData.startYear + yearOffset}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>
        <div class="mb-4">
            ราคาเปลี่ยนแปลง <input bind:value={percentChange} type="text" id="addPercent" class="textbox w-[8rem] not-italic placeholder:text-gray-600" placeholder="XX.XX" disabled> %
        </div>
        <button class="mb-4 p-2 !text-gray-200 bg-gray-700 not-disabled:hover:bg-gray-700/70 not-disabled:active:bg-gray-700/30 disabled:!text-gray-600 rounded-sm" disabled={calculating} on:click={calculate}>คำนวณ</button>
        {#if error}
            <div class="text-red-500 mb-4">{error}</div>
        {/if}
        <div class="text-[1rem]">
            ข้อมูลจาก <a class="text-gray-400 hover:text-gray-600 underline" href="https://index.tpso.go.th/cpi">สำนักงานนโยบายและยุทธศาสตร์การค้า</a><br>
            Icon จาก <a class="text-gray-400 hover:text-gray-600 underline" href="https://www.flaticon.com/free-icons/chart" title="chart icons">ioKanda (flaticon)</a><br>
            สามารถเข้าดู Source Code ได้บน <a class="text-gray-400 hover:text-gray-600 underline" href="https://github.com/supern64/thaicpi">GitHub</a><br>
            <span class="italic">*ใช้ข้อมูลของสินค้าและบริการรวมทุกประเภท และรวมทุกภูมิภาคของประเทศไทย</span>
        </div>
    </div>
</div>
