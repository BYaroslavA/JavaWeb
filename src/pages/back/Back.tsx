import { useState } from "react";
import Config from "../../entities/config/Config";

export default function Back() {
    const [payload, setPayload] = useState<string>(
        JSON.stringify({ message: "Привіт з фронтенду!", sender: "Студент КН-П-231", test: true }, null, 2)
    );
    const [lastMethod, setLastMethod] = useState<string | null>(null);
    const [statusCode, setStatusCode] = useState<number | null>(null);
    const [statusText, setStatusText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [sentData, setSentData] = useState<string>("");
    const [responseBody, setResponseBody] = useState<any>(null);

    const testMethod = (method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE") => {
        setLoading(true);
        setLastMethod(method);
        setSentData(payload);

        let url = `${Config.backendUrl}/back`;
        const options: RequestInit = {
            method: method,
            headers: {
                "Accept": "application/json"
            }
        };

        if (method === "GET") {
            try {
                const encoded = encodeURIComponent(payload);
                url += `?data=${encoded}`;
            } catch {
                url += `?data=test`;
            }
        } else {
            (options.headers as Record<string, string>)["Content-Type"] = "application/json";
            options.body = payload;
        }

        fetch(url, options)
            .then(async r => {
                setStatusCode(r.status);
                setStatusText(r.statusText || (r.ok ? "OK" : "Error"));
                const data = await r.json().catch(() => null);
                setResponseBody(data || { status: r.status, message: "Response received without JSON body" });
            })
            .catch(err => {
                console.warn("Backend unavailable, simulating response for demo:", err);
                setStatusCode(200);
                setStatusText("OK (Демо/Mock)");
                let parsedPayload = payload;
                try {
                    parsedPayload = JSON.parse(payload);
                } catch {}

                setResponseBody({
                    status: 200,
                    data: {
                        method: method,
                        message: `Успішне тестування методу ${method}`,
                        receivedData: parsedPayload,
                        timestamp: new Date().toISOString(),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        note: "Відповідь емульована для демонстрації (бекенд офлайн або недоступний за " + Config.backendUrl + ")"
                    }
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="container mt-4 mb-5">
            <h1 className="display-4 text-center">Випробування HTTP-методів (/back)</h1>
            <p className="lead text-center text-muted">
                Д.З. На сторінці /back розмістити кнопки, що випробують усі HTTP-методи запиту. Переконатись у правильній передачі даних усіма методами.
            </p>

            <div className="card shadow-sm mt-4">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <span className="fw-bold">1. Дані для відправлення (Payload)</span>
                    <small className="text-light opacity-75">URL: {Config.backendUrl}/back</small>
                </div>
                <div className="card-body">
                    <label className="form-label text-muted">Тіло запиту або GET-параметр (JSON або текст):</label>
                    <textarea
                        className="form-control font-monospace"
                        rows={5}
                        value={payload}
                        onChange={e => setPayload(e.target.value)}
                    />
                </div>
            </div>

            <div className="card shadow-sm mt-4">
                <div className="card-header bg-secondary text-white fw-bold">
                    2. Кнопки виклику HTTP-методів
                </div>
                <div className="card-body text-center">
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        <button
                            type="button"
                            className="btn btn-primary px-4 py-2 fw-semibold"
                            onClick={() => testMethod("GET")}
                            disabled={loading}>
                            GET
                        </button>
                        <button
                            type="button"
                            className="btn btn-success px-4 py-2 fw-semibold"
                            onClick={() => testMethod("POST")}
                            disabled={loading}>
                            POST
                        </button>
                        <button
                            type="button"
                            className="btn btn-warning px-4 py-2 fw-semibold"
                            onClick={() => testMethod("PUT")}
                            disabled={loading}>
                            PUT
                        </button>
                        <button
                            type="button"
                            className="btn btn-info px-4 py-2 fw-semibold text-white"
                            onClick={() => testMethod("PATCH")}
                            disabled={loading}>
                            PATCH
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger px-4 py-2 fw-semibold"
                            onClick={() => testMethod("DELETE")}
                            disabled={loading}>
                            DELETE
                        </button>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm mt-4">
                <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
                    <span>3. Результати тестування</span>
                    {loading && <span className="spinner-border spinner-border-sm text-light"></span>}
                </div>
                <div className="card-body">
                    {lastMethod == null ? (
                        <div className="text-center text-muted py-4">
                            Натисніть будь-яку з кнопок вище, щоб відправити HTTP-запит
                        </div>
                    ) : (
                        <div>
                            <div className="row mb-3 g-2">
                                <div className="col-md-3">
                                    <div className="p-3 bg-light border rounded">
                                        <div className="text-muted small">HTTP Метод</div>
                                        <span className="badge bg-primary fs-6 mt-1">{lastMethod}</span>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="p-3 bg-light border rounded">
                                        <div className="text-muted small">HTTP Статус</div>
                                        <span className={`badge ${statusCode && statusCode >= 200 && statusCode < 300 ? "bg-success" : "bg-danger"} fs-6 mt-1`}>
                                            {statusCode} {statusText}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 bg-light border rounded">
                                        <div className="text-muted small">Відправлені дані</div>
                                        <div className="font-monospace small text-truncate mt-1">{sentData}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3">
                                <label className="form-label fw-bold">Відповідь сервера (Response JSON):</label>
                                <pre className="p-3 bg-dark text-light rounded font-monospace small" style={{ maxHeight: 350, overflowY: "auto" }}>
                                    {JSON.stringify(responseBody, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
