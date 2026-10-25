export {};

declare global {
    interface Number {
        toMoney: () => string,
        endingType: () => number,
    }
}

Number.prototype.toMoney = function() : string {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

Number.prototype.endingType = function() : number {
    let n:number = this.valueOf() % 100;
    if(n>=5 && n <=20) return 0;
    n = n % 10;
    if(n == 1) return 1;
    if(n == 2 || n == 3 || n== 4) return 2;
    return 0;
}
