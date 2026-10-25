export {};

declare global {
    interface String {
        ending: (n:number, ending0:string, ending1:string, ending2:string) => string,
    }
}

String.prototype.ending = function(n, ending0, ending1, ending2) : string {
    const endingType = n.endingType();
    return this.toString() + (endingType == 0 ? ending0 : endingType == 1 ? ending1 : ending2);
}