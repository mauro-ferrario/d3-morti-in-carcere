import * as d3 from "d3";

export default class{
    constructor(chartNode, personInstance, prisonInstance, dataHandler, maxLinesHeight, linesOrBezier= 'line'){
        this.chart = chartNode;
        this.dataHandler = dataHandler;
        this.people = personInstance;
        this.prisons = prisonInstance;
        this.maxLinesHeight = maxLinesHeight;
        this.linesOrBezier = linesOrBezier;
        this.drawLines(linesOrBezier);
    }

    drawLines(linesOrBezier){
        this.chart.selectAll('g')
            .data(this.people.data)
            .enter()
            .append((d,i, lineOrBezier)=> this.drawSingleLine(d,i, linesOrBezier));
    }

    drawSingleLine(d, i, linesOrBezier){
        const svgType = linesOrBezier === 'line' ? 'line' : 'path';
        const singleLine = document.createElementNS(d3.namespaces.svg, svgType);
        const d3Selection = d3.select(singleLine);
        d3Selection
            .attr('stroke',() => {
                return this.people.reasonColors[d.reason];
            })
            .attr('stroke-width','0.5');
        if(linesOrBezier === 'line')
            this.drawLine(d3Selection, d, i);
        else
            this.drawBezier(d3Selection, d, i);
       
        return singleLine;
    }

    drawLine(svgNode, d, i){
        svgNode.attr('x1', () => {
            return this.people.barWidth*i;
        })
        .attr('y1', () => {
            return this.people.maxBarHeight;
        })
        .attr('x2', () => {
            const prisonId = this.dataHandler.getPrisonPosFromPrisonId(this.prisons.data, d.prisonId)
            return this.prisons.barWidth*prisonId;
        })
        .attr('y2', () => {
            return this.maxLinesHeight;
        });
    }

    drawBezier(svgNode, d, i){
        svgNode
            .attr("fill", "none")
            .attr("d", () =>  {
                const center = {
                    x: this.people.maxChartWidth*0.5,
                    y: this.maxLinesHeight*0.5
                }
                const prisonId = this.dataHandler.getPrisonPosFromPrisonId(this.prisons.data, d.prisonId)
                const startPos = {
                    x: this.people.barWidth*i,
                    y: this.people.maxBarHeight
                };
                const endPos = {
                    x: this.prisons.barWidth*prisonId + Math.random() * this.prisons.barWidth,
                    y: this.maxLinesHeight
                };
                const controlPoint1X = center.x;
                const controlPoint1Y = center.y;
                const controlPoint2X = center.x;
                const controlPoint2Y = center.y
                let bezjerCurve = "";
                bezjerCurve = "M "+startPos.x+" "+startPos.y;
                bezjerCurve += " C"+controlPoint1X+" "+controlPoint1Y;
                bezjerCurve += " "+controlPoint2X+" "+controlPoint2Y;
                bezjerCurve += " "+(endPos.x)+" "+(endPos.y);
                return bezjerCurve;
            });
    }
}