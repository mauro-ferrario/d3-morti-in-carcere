import * as d3 from "d3";
import yearsChart from "./years-chart";

export default class{
    constructor(chart, dataHandler, maxWidth, maxHeight) {
        this.chart = chart;
        this.dataHandler = dataHandler;
        this.width = maxWidth;
        this.height = maxHeight;
        this.reasonAndYearHeight = 10;
        this.yearsStartPosY = 1200;
        this.offsetXYears = [];
        this.totDeadPerson = this.dataHandler.getData().people.length;
        this.dataHandler.getData().years.map((year) => {
            this.offsetXYears.push(0);
        });
        this.reasonColors = [
            'rgb(125,179,12)',
            'rgb(240,158,16)',
            'rgb(213,25,27)',
            'rgb(74,32,171)',
            'rgb(0,230,255)'
        ];
        this.setupYears();
        this.setupShapesReasonAndYear();
    }

    
    setupYears(){
        const yearsBlock = this.chart.append('g').attr('class','years').attr('transform','translate(0,'+this.yearsStartPosY+')');
        let data = this.dataHandler.getData().years;
        this.years = new yearsChart(yearsBlock, data, this.width, this.reasonAndYearHeight);
    }

    getYearBarSizes(pos){
        const node = (this.years.chart).select('g:nth-child('+(pos+1)+')');
        const nodeRect = node.select('rect');
        const transform = node.attr('transform');
        const commaPos = transform.indexOf(',');
        const openBracketsPos = transform.indexOf('(');
        const x = +parseFloat(transform.substring(openBracketsPos+1, commaPos));
        const width = parseFloat(nodeRect.attr('width'));
        const totDeadPeopleThisYear = this.dataHandler.getData().years[pos].deadPeople;
        return {
            x,
            width,
            totDeadPeopleThisYear
        };
    }

    setupShapesReasonAndYear(){
        let offsetXReason = 0;
        const reasonData = this.dataHandler.getData().reasonByAge;
        reasonData.map((reasonByAge, i) => {
            const totDeadPeopleByReason = this.dataHandler.getData().reasonByAge[i].deadPeople;
            const maxReasonBlockWidth = this.width * (totDeadPeopleByReason/this.totDeadPerson);
            const block = this.chart.append('g').attr('class','reasonAndAge-'+reasonByAge.reasonId);
            const mainColor = this.reasonColors[reasonByAge.reasonId];
            this.drawReasonToYears(block, i, offsetXReason, maxReasonBlockWidth,mainColor);
            offsetXReason += maxReasonBlockWidth;
        });
    }

    drawReasonToYears(block, pos, offsetX, maxReasonBlockWidth, mainColor){
        let data = this.dataHandler.getData().reasonByAge[pos];
        const convertIntoRange = d3.scaleLinear().range([0, maxReasonBlockWidth]);
        convertIntoRange.domain([0, data.deadPeople])
        let bars = block.selectAll("g")
            .data(data.years)
            .enter().append("g");
        this.drawReasonsBars(bars, convertIntoRange, offsetX, mainColor);
        this.drawBarsFromReasonToYears(bars, convertIntoRange, offsetX, mainColor);
    }

    drawBarsFromReasonToYears(bars, convertIntoRange, offsetX, mainColor){
        let cumulateX = offsetX;
        bars
            .append('path')
            .style('fill', (d,i) =>{
                return mainColor;
            })
            .style('opacity', (d,i) =>{
                return 1.6;
            })
            .attr('class', 'dead-people')
            
            .attr("d", (d,i) =>  {
                const barWidth = convertIntoRange(d);
                const deadInThatYear = d;
                const barPos = cumulateX;
                cumulateX += barWidth;
                const yearSize = this.getYearBarSizes(i);
                const proportion = deadInThatYear / yearSize.totDeadPeopleThisYear;
                const center = {
                    x: barPos + (barWidth*0.5),
                    y: (this.yearsStartPosY - this.reasonAndYearHeight)*.5
                }
                const startPos = {
                    x: barPos,
                    y: this.reasonAndYearHeight
                };
                const endPos = {
                    x: this.offsetXYears[i] + yearSize.x,
                    y: this.yearsStartPosY
                };
                const controlPoint1X = center.x;
                const controlPoint1Y = center.y;
                const controlPoint2X = center.x;
                const controlPoint2Y = center.y
                let bezjerCurve = "";
                bezjerCurve = "M "+startPos.x+" "+(startPos.y);
                bezjerCurve += " C "+controlPoint1X+" "+controlPoint1Y;
                bezjerCurve += " "+controlPoint2X+" "+controlPoint2Y;
                bezjerCurve += " "+(endPos.x)+" "+(endPos.y);
                bezjerCurve += " L "+(endPos.x+yearSize.width*proportion)+" "+(endPos.y);
                bezjerCurve += " C "+controlPoint1X+" "+controlPoint1Y;
                bezjerCurve += " "+controlPoint2X+" "+controlPoint2Y;
                bezjerCurve += " "+(startPos.x + barWidth)+" "+(startPos.y);
                bezjerCurve += " L "+(startPos.x)+" "+(startPos.y);
                this.offsetXYears[i] += yearSize.width*proportion;
                return bezjerCurve;
        });
    }

    drawReasonsBars(bars, convertIntoRange, offsetX, mainColor){
        let cumulateX = 0;
        bars.append("rect")
            .style('fill', (d,i) =>{
                return mainColor;
            })
            .attr('class', 'dead-people')
            .attr("y", (d) => { return 0; })
            .attr('x',(d) => {
                const barWidth = convertIntoRange(d);
                const barPos = offsetX + cumulateX;
                cumulateX += barWidth;
                return barPos; 
            })
            .attr("height", (d) => { 
                return this.reasonAndYearHeight; 
            })
            .attr("width", (d) =>{
                const barWidth = convertIntoRange(d);
                return barWidth;
            });
    }
}