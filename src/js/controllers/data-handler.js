import EventEmitter from 'events';
import * as d3 from "d3";


export const events = {
    "data-loaded" : 'data-handler__data-loaded'
};

export default class extends EventEmitter{
    constructor(){
        super();
        this.originalData = undefined;
    }

    loadJsonData(urlJson){
        d3.json(urlJson).then((data) => {
            this.originalData = data;
            this.manipulateData(data);
            this.emit(events['data-loaded'], this.data);
        });
    }

    manipulateData(data){
        this.data = data;
    }

    getData(){
        return this.data;
    }
    
}