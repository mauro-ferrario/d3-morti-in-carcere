import * as d3 from "d3";

export default class{
    constructor(chart, data, maxChartWidth){
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
        this.maxBarHeight = 40;
        this.convertIntoRangeAge = d3.scaleLinear().range([0, this.maxBarHeight]);
        this.convertIntoRangeAge.domain([0, d3.max(data, function(d) { return d.age; })])
        this.peopleBars = this.createMainPeopleGroups();
        this.createSinglePeopleContent();
    }

    createSinglePeopleContent(){
        this.peopleBars.append("rect")
            .attr("y", (d) => { return 0; })
            .attr("height", (d) => { 
                return this.maxBarHeight; 
            })
            .style('fill', (d) => this.reasonColors[d.reason])
            .attr("width", () =>{
                return this.barWidth
            });
        this.peopleBars.append("rect")
            .attr('class', 'person-age')
            .attr("y", (d) => { return this.maxBarHeight - this.convertIntoRangeAge(d.age); })
            .attr("height", (d) => { 
                return this.convertIntoRangeAge(d.age); 
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