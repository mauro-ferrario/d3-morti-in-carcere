import dataHandler from "./data-handler";

export default class extends dataHandler{
    constructor(){
        super();
    }

    manipulateData(data){
        this.data = {};
        this.createDataArrays(data);
        console.log(this.data.years);
        console.log(this.data.people);
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
        this.data.years = this.createYearsGroupsArray();
        this.data.prisons = this.createPrisonsArray(data);
        this.data.people = [];
        data.map((info)=>{
            const prisonId = this.getPrisonIdFromPrisonEmail(this.data.prisons, info['Email']);
            this.data.prisons[prisonId].deadPeople++;
            const yearOfDeath = +info['Data del decesso'].substring(info['Data del decesso'].lastIndexOf('/')+1);
            const yearIndex = this.data.years.length - (2012 - yearOfDeath)-1;
            this.data.years[yearIndex].deadPeople++;
            this.data.people.push({
                deathData: info['Data del decesso'],
                name: info['Nome'],
                age: +info['age'],
                reason: this.getReasonId(info['reason']),
                prisonId: prisonId
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

    createYearsGroupsArray(){
        let years = [];
        for(let a = 2002; a <= 2012; a++){
            years.push({
                year: a,
                deadPeople: 0
            });
        }
        return years;
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

    // Pass the data array because we could want to search on different order array

    getPrisonIdFromPrisonEmail(prisonData, email){
        const foundPrison = prisonData.find((prison) => {
            return prison.email == email
        });
        return foundPrison.id;
    }

    getPrisonPosFromPrisonId(prisonData, prisonId){
        let foundPrison = -1;
        prisonData.map((prison, i) => {
            if(prison.id == prisonId)
                foundPrison = i;
        });
        return foundPrison;
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