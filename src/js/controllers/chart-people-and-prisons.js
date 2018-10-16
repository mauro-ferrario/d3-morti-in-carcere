import peopleChart from "./people-chart";
import prisonsChart from "./prisons-chart";
import lines from "./lines";

export default class{
    constructor(chart, dataHandler, maxWidth, maxHeight) {
        this.chart = chart;
        this.dataHandler = dataHandler;
        this.width = maxWidth;
        this.height = maxHeight;
        this.setupPeople();
        this.setupPrisons();
        this.setupLines();
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
        prisonsBlock.attr('transform','translate(0,'+this.height+')');
    }

    setupLines(){
        const linesBlock = this.chart.append('g').attr('class','lines');
        this.lines = new lines(linesBlock, this.people, this.prisons, this.dataHandler, this.height, 'bezier');
    }
}