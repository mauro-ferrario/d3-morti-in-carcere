import dataHandler from "./data-handler";

export default class extends dataHandler{
    constructor(){
        super();
    }

    manipulateData(data){
        this.data = {};
        this.createDataArrays(data);
    }

    createDataArrays(data){
        /*
            Data del decesso: "17/4/2012"
            Email: "cc.foggia@giustizia.it"
            Indirizzo: "Via delle Casermette 22     71100    FOGGIA Italy"
            Istituto penitenziario: "Casa circondariale - Casa di reclusione di FOGGIA"
            Nome: "Michele Valente"
            Telefono: "0881/778156 - 7 - 8"
            age: 28
            reason: "daAccertare"
        */
        this.data.reasons = this.createReasonsArray();
        this.data.prisons = this.createPrisonsArray(data);
        this.data.people = [];
        data.map((info)=>{
            const prisonId = this.getPrisonIdFromPrisonEmail(info['Email']);
            this.data.prisons[prisonId].deadPeople++;
            this.data.people.push({
                deathData: info['Data del decesso'],
                name: info['Nome'],
                age: +info['age'],
                reason: this.getReasonId(info['reason'])
            });
        });
    }

    getReasonId(reasonToCheck){
        let index = -1;
        this.data.reasons.map((reason,i) =>{
            if(reason.toLowerCase() === reasonToCheck.toLowerCase())
                index = i;
        });
        return index;
    }

    createReasonsArray(){
        let reasons = [
            'DaAccertare',
            'Suicidio',
            'Malattia',
            'Overdose',
            'Omicidio'
        ];
        return reasons;
    }

    createPrisonsArray(data){
        let prisonsObj = {};
        let prisons = [];
        data.map((info)=>{
            const instituteMail = info['Email'];
            if(!prisonsObj[instituteMail]){
                const instituteInfo = {
                    id: prisons.length,
                    name: info['Istituto penitenziario'],
                    address: info['Indirizzo'],
                    phone: info['Telefono'],
                    email: instituteMail,
                    deadPeople: 0
                };
                prisonsObj[instituteMail] = instituteInfo;
                prisons.push(instituteInfo);
            }
        });
        return prisons;
    }

    getPrisonIdFromPrisonEmail(email){
        const foundPrison = this.data.prisons.find((prison) => {
            return prison.email == email
        });
        return foundPrison.id;
    }

    compare(orderValue) {
        return function(a,b){
            if (a[orderValue] < b[orderValue])
                return -1;
             if (a[orderValue] > b[orderValue])
                return 1;
          return 0;
        }
        console.log(orderValue);
        
      }

    getOrderArray(arr, orderValue){
        return arr.sort(this.compare(orderValue));
    }
}