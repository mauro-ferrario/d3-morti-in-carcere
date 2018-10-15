import * as d3 from "d3";
import barsChart from "./bars-chart";

export default class extends barsChart{
    constructor(chartNode, data, maxChartWidth, maxBarHeight){
        super(chartNode, data, maxChartWidth, maxBarHeight);
    }

    setBarsDomain(data){
        this.barConvertIntoRange.domain([0, d3.max(data, function(d) { return d.deadPeople; })])
    }

    extraSettingsBeforeCreateBars(){

    }

    createSingleBarsContent(){
        this.bars.append("rect")
            .attr('class', 'dead-people')
            .attr("y", (d) => { return 0; })
            .attr("height", (d) => { 
                return this.barConvertIntoRange(d.deadPeople); 
            })
            .attr("width", () =>{
                return this.barWidth
            });
    }
}