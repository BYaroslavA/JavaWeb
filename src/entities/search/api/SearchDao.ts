import type ISearchResult from "../model/ISearchResult";

export default class SearchDao {
    static GetSearchResult(_data:string): Promise<ISearchResult> {
        return new Promise<ISearchResult>((resolve) => {
            setTimeout(
                () => {
                    resolve({
                        products: [],
                        sections: []
                    });
                },
                1300
            );
        });
    }
}
