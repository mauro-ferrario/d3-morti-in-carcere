import * as d3 from "d3";
import barsChart from "./bars-chart";

export default class extends barsChart{
    constructor(chartNode, data, maxChartWidth, maxBarHeight){
        super(chartNode, data, maxChartWidth, maxBarHeight);
    }

    extraSettingsBeforeCreateBars(){
        this.reasonColors = [
            'rgb(125,179,12)',
            'rgb(240,158,16)',
            'rgb(213,25,27)',
            'rgb(74,32,171)',
            'rgb(0,230,255)'
        ];
    }

    setBarsDomain(data){
        this.barConvertIntoRange.domain([0, d3.max(data, function(d) { return d.age; })])
    }

    createSingleBarsContent(){
        this.bars.append("rect")
            .attr("y", (d) => { return 0; })
            .attr("height", (d) => { 
                return this.maxBarHeight; 
            })
            .style('fill', (d) => this.reasonColors[d.reason])
            .attr("width", () =>{
                return this.barWidth
            });
        this.bars.append("rect")
            .attr('class', 'person-age')
            .attr("y", (d) => { return this.maxBarHeight - this.barConvertIntoRange(d.age); })
            .attr("height", (d) => { 
                return this.barConvertIntoRange(d.age); 
            })
            .attr("width", () =>{
                return this.barWidth
            });
    }
}