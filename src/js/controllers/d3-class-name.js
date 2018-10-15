import * as d3 from "d3";
import CustomDataHandler from "./custom-data-handler";
import {events as CustomDataEvents} from "./data-handler";
require ("../../css/components/d3-class-name.scss");

export default class{
    constructor(el){
        this.el = el;
        this.dataHandler = new CustomDataHandler;
        this.setChart();
        this.readData('data/data.json');
    }

    readData(url){
        // Convert this to promise
        this.dataHandler.on(CustomDataEvents['data-loaded'], this.onDataReady);
        this.dataHandler.loadJsonData(url);
    }

    onDataReady(data){
        console.log(data);
    }

    setChart(){
        this.chart = d3.select('[data-controller="d3-class-name"] .chart');
    }
}