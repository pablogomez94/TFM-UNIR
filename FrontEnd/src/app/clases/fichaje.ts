export class fichaje{
    precision:number;
    evento:number;
    ubicacion:string;
    cliente:string;
    constructor(precision,evento,ubicacion){
        this.precision=precision
        this.evento=evento;
        this.ubicacion=ubicacion;
        this.cliente="";
    }
}