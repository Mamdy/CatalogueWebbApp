export class AppResponse {
  _embedded : any;

  constructor(){

  }
  getData(){
    return this._embedded;
  }


}
