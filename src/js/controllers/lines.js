import * as d3 from "d3";

export default class{
    constructor(chartNode, personInstance, prisonInstance, dataHandler, maxLinesHeight){
        this.chart = chartNode;
        this.dataHandler = dataHandler;
        this.people = personInstance;
        this.prisons = prisonInstance;
        this.maxLinesHeight = maxLinesHeight;
        this.drawLines();
    }

    drawLines(){
        this.chart.selectAll('g')
            .data(this.people.data)
            .enter()
            .append('line')
                .attr('stroke',(d) => {
                    return this.people.reasonColors[d.reason];
                })
                .attr('stroke-width','0.5')
                .attr('x1', (d,i) => {
                    return this.people.barWidth*i;
                })
                .attr('y1', (d) => {
                    return this.people.maxBarHeight;
                })
                .attr('x2', (d,i) => {
                    const prisonId = this.dataHandler.getPrisonPosFromPrisonId(this.prisons.data, d.prisonId)
                    return this.prisons.barWidth*prisonId;
                })
                .attr('y2', (d) => {
                    return this.maxLinesHeight;
                });
    }
}