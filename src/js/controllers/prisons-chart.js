import * as d3 from "d3";

export default class{
    constructor(chart, data, maxChartWidth){
        console.log(data);
        this.chart = chart;
        this.data = data;
        this.reasonColors = [
            'rgb(125,179,12)',
            'rgb(240,158,16)',
            'rgb(213,25,27)',
            'rgb(74,32,171)',
            'rgb(0,230,255)'
        ];
        this.maxChartWidth = maxChartWidth;
        this.barWidth = this.maxChartWidth/this.data.length;
        this.maxBarHeight = 140;
        this.convertIntoRangeAge = d3.scaleLinear().range([0, this.maxBarHeight]);
        this.convertIntoRangeAge.domain([0, d3.max(data, function(d) { return d.deadPeople; })])
        this.peopleBars = this.createMainPeopleGroups();
        this.createSinglePeopleContent();
    }

    createSinglePeopleContent(){
        this.peopleBars.append("rect")
            .attr('class', 'dead-people')
            .attr("y", (d) => { return 0; })
            .attr("height", (d) => { 
                return this.convertIntoRangeAge(d.deadPeople); 
            })
            .attr("width", () =>{
                return this.barWidth
            });
    }

    createMainPeopleGroups(){
        return this.chart.selectAll("g")
            .data(this.data)
            .enter().append("g")
                .attr("transform", (d, i) => { return "translate(" + i * this.barWidth + ", 0)"; });
    }
}