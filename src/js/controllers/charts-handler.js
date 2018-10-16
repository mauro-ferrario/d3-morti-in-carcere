import * as d3 from "d3";
import CustomDataHandler from "./custom-data-handler";
import {events as CustomDataEvents} from "./data-handler";
import peopleAndPrisons from "./chart-people-and-prisons";
import reasonsAndYears from "./reasons-and-years";

require ("../../css/components/charts-handler.scss");

export default class{
    constructor(el){
        this.el = el;
        this.dataHandler = new CustomDataHandler;
        this.setupChar();
        this.prisonBarPositionY = this.charHeight - 140;
        this.readData('data/data.json');
    }

    readData(url){
        // Convert this to promise
        this.dataHandler.on(CustomDataEvents['data-loaded'], this.onDataReady.bind(this));
        this.dataHandler.loadJsonData(url);
    }

    onDataReady(data){
        // this.setupPeopleAndPrisons();
         this.setupReasonsAndYears();
    }

    setupPeopleAndPrisons(){
        this.peopleAndPrisons = new peopleAndPrisons(this.chart, this.dataHandler, this.width, this.prisonBarPositionY);
    }

    setupReasonsAndYears(){
        this.reasonsAndYears = new reasonsAndYears(this.chart, this.dataHandler, this.width, this.prisonBarPositionY);
    }

    setupChar(){
        this.charWidth = window.innerWidth;
        this.charHeight = window.innerHeight;
        this.margin = {top: 50, right: 50, bottom: 50, left: 50};
        this.width = this.charWidth - this.margin.left - this.margin.right;
        this.height = this.charHeight - this.margin.top - this.margin.bottom;
        this.chart = d3.select('[data-controller="charts-handler"] .chart')
            .attr("width", this.charWidth)
            .attr("height", this.charHeight)
            .append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }    
}