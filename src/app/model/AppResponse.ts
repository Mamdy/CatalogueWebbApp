export class AppResponse {
  _embedded : any;
  page: any;

  constructor(){

  }

  getData():any{
    return this._embedded;
  }
getpage() {
    return this.page;
}

}
