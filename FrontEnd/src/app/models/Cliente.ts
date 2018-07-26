import {Evento} from "./Evento";
export class Cliente{
    constructor(
        public Nombre:string,
        public ID:number,
        public LastModify:string,
        public eventos:Array<Evento>,
        public info:string
    ){}
}