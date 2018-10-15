import * as d3 from "d3";

export default class{
    constructor(chartNode, data, maxChartWidth, maxBarHeight){
        this.chart = chartNode;
        this.data = data;
        this.maxChartWidth = maxChartWidth;
        this.barWidth = this.maxChartWidth/this.data.length;
        this.maxBarHeight = maxBarHeight;
        this.barConvertIntoRange = d3.scaleLinear().range([0, this.maxBarHeight]);
        this.setBarsDomain(data)
        this.extraSettingsBeforeCreateBars();
        this.bars = this.createMainBarsGroups();
        this.createSingleBarsContent();
    }

    extraSettings(){

    }

    setBarsDomain(){
    }

    createMainBarsGroups(){
        return this.chart.selectAll("g")
            .data(this.data)
            .enter().append("g")
                .attr("transform", (d, i) => { return "translate(" + i * this.barWidth + ", 0)"; });
    }

    createSingleBarsContent(){

    }
}