import * as d3 from "d3";
import CustomDataHandler from "./custom-data-handler";
import {events as CustomDataEvents} from "./data-handler";
import peopleChart from "./people-chart";
import prisonsChart from "./prisons-chart";
import lines from "./lines";
require ("../../css/components/d3-class-name.scss");

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
        this.setupPeople();
        this.setupPrisons();
        this.setupLines();
        this.setupShapesReasonAndAge();
    }

    setupShapesReasonAndAge(){
        const reasonAndAgeBlock = this.chart.append('g').attr('class','reasonAndAge').attr('transform','translate(0,200)');
        let data = this.dataHandler.getData().reasonByAge[0];
        console.log( data.deadPeople);
        const convertIntoRange = d3.scaleLinear().range([0, this.width]);
        convertIntoRange.domain([0, data.deadPeople])
        console.log(data);
        let cumulateX = 0;
        let bars = reasonAndAgeBlock.selectAll("g")
            .data(data.years)
            .enter().append("g")
                .attr("transform", (d, i) => {  
                    const barWidth = convertIntoRange(d);
                    const barPos = cumulateX;
                    cumulateX += barWidth;
                    return "translate(" + barPos + ", 0)"; 
                });
        // this.people = new peopleChart(peopleBlock, data, this.width, 40);

        bars.append("rect")
            .style('fill', (d,i) =>{
                return 'rgb('+255/11*i+',0,0)';
            })
            .attr('class', 'dead-people')
            .attr("y", (d) => { return 0; })
            .attr("height", (d) => { 
                return 100; 
            })
            .attr("width", (d) =>{
                const barWidth = convertIntoRange(d);
                return barWidth;
            });
    }

    setupChar(){
        this.charWidth = window.innerWidth;
        this.charHeight = window.innerHeight;
        this.margin = {top: 50, right: 50, bottom: 50, left: 50};
        this.width = this.charWidth - this.margin.left - this.margin.right;
        this.height = this.charHeight - this.margin.top - this.margin.bottom;
        this.chart = d3.select('[data-controller="d3-class-name"] .chart')
            .attr("width", this.charWidth)
            .attr("height", this.charHeight)
            .append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    setupPeople(){
        const peopleBlock = this.chart.append('g').attr('class','people');
        let data = this.dataHandler.getData().people;
        data = this.dataHandler.getOrderArray(data, 'reason');
        this.people = new peopleChart(peopleBlock, data, this.width, 40);
    }

    setupPrisons(){
        const prisonsBlock = this.chart.append('g').attr('class','prisons');
        let data = this.dataHandler.getData().prisons;
        // data = this.dataHandler.getOrderArray(data, 'deadPeople');
        this.prisons = new prisonsChart(prisonsBlock, data, this.width, 40);
        prisonsBlock.attr('transform','translate(0,'+this.prisonBarPositionY+')');
    }

    setupLines(){
        const linesBlock = this.chart.append('g').attr('class','lines');
        this.lines = new lines(linesBlock, this.people, this.prisons, this.dataHandler, this.prisonBarPositionY, 'bezier');
    }
}