import * as d3 from "d3";
import barsChart from "./bars-chart";

export default class extends barsChart{
    constructor(chartNode, data, maxChartWidth, maxBarHeight){
        super(chartNode, data, maxChartWidth, maxBarHeight);
    }

    extraSettingsBeforeCreateBars(){
        this.barWidthConvertInRange = d3.scaleLinear().range([0, this.maxChartWidth]);
    }

    setBarsDomain(data){
        this.barWidthConvertInRange.domain([0, 915])
    }

    createMainBarsGroups(){
        let barPosX = 0;
        return this.chart.selectAll("g")
            .data(this.data)
            .enter().append("g")
                .attr("transform", (d, i) => {
                    const barX = barPosX;
                    const customBarWidth = this.barWidthConvertInRange(d.deadPeople);
                    barPosX += customBarWidth;
                    return "translate(" + barX + ", 0)"; 
                });
    }

    createSingleBarsContent(){
        this.bars.append("rect")
            .attr("x", (d) => { 
                return 0;
            })
            .attr("y", (d) => { return 0; })
            .attr("height", (d) => { 
                return this.maxBarHeight; 
            })
            .style('fill', (d,i) => { 
                return 'rgb('+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+')';
                }
            )
            .attr("width", (d,i) =>{
                const customBarWidth = this.barWidthConvertInRange(d.deadPeople);
                return customBarWidth;
            });
    }
}