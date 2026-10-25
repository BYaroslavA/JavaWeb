import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import type ISearchResult from "../../entities/search/model/ISearchResult";
import SearchDao from "../../entities/search/api/SearchDao";
import { AppContext } from "../../features/app_context/AppContext";

export default function Search() {
    const {slug} = useParams();
    const search = decodeURIComponent(slug ?? "");
    const [result, setResult] = useState<ISearchResult|null>(null);
    const {setBusy} = useContext(AppContext);
    const taskRef = useRef<Promise<void>>(null);

    useEffect(() => {
        setBusy(true);
        taskRef.current = SearchDao.GetSearchResult(search)
        .then(setResult)
        .finally(() => setBusy(false));

        return () => {
            if(taskRef.current) {
                console.log("Search task cancelled");
            }
        };
    }, [slug]);

    return <>
    <h1>Search</h1>
    За запитом '{search}'
    <br/>
    {result != null && <>
        <i>Розділи: </i> {result.sections.length == 0 
        ? <b>Нічого не знайдено</b> 
        : <b>Знайдено</b> }
        <br/>
        <i>Товари: </i> {result.products.length == 0 
        ? <b>Нічого не знайдено</b> 
        : <b>Знайдено</b> }
    </>}
    </>;
}
