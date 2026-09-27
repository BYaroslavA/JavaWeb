<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String contextPath = request.getContextPath();
%>
<div class="card back-container">
    <div class="back-header">
        <h2>Випробування HTTP-методів запиту</h2>
        <p class="back-subtitle">
            Інструмент для перевірки передачі та коректної обробки даних на бекенді усіма стандартними методами протоколу HTTP.
        </p>
    </div>

    <div class="http-grid">
        <!-- GET Card -->
        <div class="method-card get-card">
            <div class="method-card-header">
                <span class="method-badge badge-get">GET</span>
                <span class="method-desc">Отримання даних (Query Parameters)</span>
            </div>
            <div class="method-card-body">
                <label for="get-param" class="input-label">Параметри запиту (URL query):</label>
                <input type="text" id="get-param" class="method-input" value="mode=test&timestamp=now&author=student">
                <button type="button" id="btn-get" class="btn btn-get" onclick="sendRequest('GET')">
                    Випробувати GET
                </button>
            </div>
        </div>

        <!-- POST Card -->
        <div class="method-card post-card">
            <div class="method-card-header">
                <span class="method-badge badge-post">POST</span>
                <span class="method-desc">Створення ресурсу (JSON Body)</span>
            </div>
            <div class="method-card-body">
                <label for="post-body" class="input-label">Тіло запиту (JSON):</label>
                <textarea id="post-body" class="method-textarea" rows="3">{
  "action": "create_item",
  "title": "Новий елемент",
  "priority": 1
}</textarea>
                <button type="button" id="btn-post" class="btn btn-post" onclick="sendRequest('POST')">
                    Випробувати POST
                </button>
            </div>
        </div>

        <!-- PUT Card -->
        <div class="method-card put-card">
            <div class="method-card-header">
                <span class="method-badge badge-put">PUT</span>
                <span class="method-desc">Повне оновлення ресурсу (JSON Body)</span>
            </div>
            <div class="method-card-body">
                <label for="put-body" class="input-label">Тіло запиту (JSON):</label>
                <textarea id="put-body" class="method-textarea" rows="3">{
  "id": 101,
  "title": "Повністю оновлений елемент",
  "status": "updated",
  "version": 2
}</textarea>
                <button type="button" id="btn-put" class="btn btn-put" onclick="sendRequest('PUT')">
                    Випробувати PUT
                </button>
            </div>
        </div>

        <!-- PATCH Card -->
        <div class="method-card patch-card">
            <div class="method-card-header">
                <span class="method-badge badge-patch">PATCH</span>
                <span class="method-desc">Часткове оновлення (JSON Body)</span>
            </div>
            <div class="method-card-body">
                <label for="patch-body" class="input-label">Тіло запиту (JSON):</label>
                <textarea id="patch-body" class="method-textarea" rows="3">{
  "id": 101,
  "status": "patched_value"
}</textarea>
                <button type="button" id="btn-patch" class="btn btn-patch" onclick="sendRequest('PATCH')">
                    Випробувати PATCH
                </button>
            </div>
        </div>

        <!-- DELETE Card -->
        <div class="method-card delete-card">
            <div class="method-card-header">
                <span class="method-badge badge-delete">DELETE</span>
                <span class="method-desc">Видалення ресурсу (ID / Query)</span>
            </div>
            <div class="method-card-body">
                <label for="delete-param" class="input-label">Параметри видалення (query):</label>
                <input type="text" id="delete-param" class="method-input" value="id=101&reason=cleanup">
                <button type="button" id="btn-delete" class="btn btn-delete" onclick="sendRequest('DELETE')">
                    Випробувати DELETE
                </button>
            </div>
        </div>

        <!-- OPTIONS Card -->
        <div class="method-card options-card">
            <div class="method-card-header">
                <span class="method-badge badge-options">OPTIONS</span>
                <span class="method-desc">Опитування можливостей (Allow methods)</span>
            </div>
            <div class="method-card-body">
                <p class="method-note">Перевіряє доступні HTTP-методи та CORS-заголовки сервера.</p>
                <button type="button" id="btn-options" class="btn btn-options" onclick="sendRequest('OPTIONS')">
                    Випробувати OPTIONS
                </button>
            </div>
        </div>

        <!-- HEAD Card -->
        <div class="method-card head-card">
            <div class="method-card-header">
                <span class="method-badge badge-head">HEAD</span>
                <span class="method-desc">Отримання заголовків без тіла відповіді</span>
            </div>
            <div class="method-card-body">
                <p class="method-note">Сервер повертає лише метадані та заголовки (без передачі тіла).</p>
                <button type="button" id="btn-head" class="btn btn-head" onclick="sendRequest('HEAD')">
                    Випробувати HEAD
                </button>
            </div>
        </div>
    </div>

    <!-- Quick test all buttons -->
    <div class="test-all-bar">
        <button type="button" id="btn-test-all" class="btn btn-primary" onclick="testAllMethods()">
            Випробувати всі методи по черзі
        </button>
        <button type="button" id="btn-clear-console" class="btn btn-secondary" onclick="clearResults()">
            Очистити результат
        </button>
    </div>

    <!-- Result / Inspection Panel -->
    <div class="response-panel">
        <div class="response-panel-header">
            <div class="response-title">
                Результат відповіді сервера:
                <span id="response-status-badge" class="response-status-badge status-idle">Очікування запиту</span>
            </div>
            <div id="response-time" class="response-time"></div>
        </div>

        <div class="response-section">
            <div class="section-title">Отримані заголовки (Headers):</div>
            <pre id="response-headers" class="code-block">(заголовки з'являться після виконання запиту)</pre>
        </div>

        <div class="response-section">
            <div class="section-title">Тіло відповіді сервера (JSON / Body):</div>
            <pre id="response-body" class="code-block">(тіло відповіді з'явиться після виконання запиту)</pre>
        </div>
    </div>
</div>

<script>
    const baseUrl = '<%= contextPath %>/back';

    async function sendRequest(method) {
        const statusBadge = document.getElementById('response-status-badge');
        const timeBox = document.getElementById('response-time');
        const headersBox = document.getElementById('response-headers');
        const bodyBox = document.getElementById('response-body');

        statusBadge.className = 'response-status-badge status-loading';
        statusBadge.textContent = 'Відправка ' + method + '...';
        headersBox.textContent = 'Очікування...';
        bodyBox.textContent = 'Очікування...';
        timeBox.textContent = '';

        let url = baseUrl;
        const options = {
            method: method,
            headers: {
                'Accept': 'application/json'
            }
        };

        if (method === 'GET') {
            const query = document.getElementById('get-param').value.trim();
            if (query) {
                url += (query.startsWith('?') ? '' : '?') + query + '&ajax=true';
            } else {
                url += '?ajax=true';
            }
        } else if (method === 'DELETE') {
            const query = document.getElementById('delete-param').value.trim();
            if (query) {
                url += (query.startsWith('?') ? '' : '?') + query;
            }
        } else if (method === 'POST') {
            options.headers['Content-Type'] = 'application/json; charset=utf-8';
            options.body = document.getElementById('post-body').value;
        } else if (method === 'PUT') {
            options.headers['Content-Type'] = 'application/json; charset=utf-8';
            options.body = document.getElementById('put-body').value;
        } else if (method === 'PATCH') {
            options.headers['Content-Type'] = 'application/json; charset=utf-8';
            options.body = document.getElementById('patch-body').value;
        }

        const startTime = performance.now();

        try {
            const resp = await fetch(url, options);
            const duration = Math.round(performance.now() - startTime);

            statusBadge.textContent = method + ' → ' + resp.status + ' ' + resp.statusText;
            statusBadge.className = 'response-status-badge ' + (resp.ok ? 'status-ok' : 'status-err');
            timeBox.textContent = 'Час відповіді: ' + duration + ' ms';

            // Extract all headers
            let headerText = '';
            for (let [name, val] of resp.headers.entries()) {
                headerText += name + ': ' + val + '\n';
            }
            headersBox.textContent = headerText || '(Немає доступних заголовків)';

            if (method === 'HEAD') {
                bodyBox.textContent = '(За специфікацією HTTP метод HEAD не повертає тіло. Заголовки отримано успішно!)';
            } else {
                const text = await resp.text();
                try {
                    const parsed = JSON.parse(text);
                    bodyBox.textContent = JSON.stringify(parsed, null, 2);
                } catch {
                    bodyBox.textContent = text || '(Порожня відповідь)';
                }
            }
        } catch (err) {
            statusBadge.textContent = 'Помилка мережі';
            statusBadge.className = 'response-status-badge status-err';
            bodyBox.textContent = 'Помилка виконання fetch: ' + err.message;
            headersBox.textContent = '-';
        }
    }

    async function testAllMethods() {
        const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
        for (const m of methods) {
            await sendRequest(m);
            await new Promise(r => setTimeout(r, 600));
        }
    }

    function clearResults() {
        document.getElementById('response-status-badge').className = 'response-status-badge status-idle';
        document.getElementById('response-status-badge').textContent = 'Очікування запиту';
        document.getElementById('response-time').textContent = '';
        document.getElementById('response-headers').textContent = '(заголовки з\'являться після виконання запиту)';
        document.getElementById('response-body').textContent = '(тіло відповіді з\'явиться після виконання запиту)';
    }
</script>
