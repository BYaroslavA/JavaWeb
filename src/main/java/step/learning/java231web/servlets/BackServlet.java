package step.learning.java231web.servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;
import com.google.inject.Singleton;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import step.learning.java231web.rest.RestResponse;
import step.learning.java231web.rest.RestStatus;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Singleton
public class BackServlet extends HttpServlet {

    private final Gson gson = new GsonBuilder()
            .serializeNulls()
            .setPrettyPrinting()
            .setDateFormat("yyyy-MM-dd HH:mm:ss")
            .create();

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if ("PATCH".equalsIgnoreCase(req.getMethod())) {
            doPatch(req, resp);
        } else {
            super.service(req, resp);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String accept = req.getHeader("Accept");
        String ajax = req.getParameter("ajax");
        if (accept != null && accept.contains("text/html") && !"true".equalsIgnoreCase(ajax)) {
            req.setAttribute("servlet", "Back");
            req.getRequestDispatcher("index.jsp").forward(req, resp);
            return;
        }

        Map<String, Object> responseData = new LinkedHashMap<>();
        responseData.put("method", "GET");
        responseData.put("receivedParams", getRequestParameters(req));
        responseData.put("timestamp", new Date().toString());
        responseData.put("message", "GET-запит успішно оброблено сервером");

        sendRestResponse(resp, RestStatus.Ok, responseData);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Map<String, Object> responseData = new LinkedHashMap<>();
        responseData.put("method", "POST");
        responseData.put("receivedParams", getRequestParameters(req));
        responseData.put("receivedBody", parseBody(req));
        responseData.put("contentType", req.getContentType());
        responseData.put("timestamp", new Date().toString());
        responseData.put("message", "POST-запит успішно прийнято (створено ресурс)");

        sendRestResponse(resp, RestStatus.Created, responseData);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Map<String, Object> responseData = new LinkedHashMap<>();
        responseData.put("method", "PUT");
        responseData.put("receivedParams", getRequestParameters(req));
        responseData.put("receivedBody", parseBody(req));
        responseData.put("contentType", req.getContentType());
        responseData.put("timestamp", new Date().toString());
        responseData.put("message", "PUT-запит успішно оброблено (повне оновлення ресурсу)");

        sendRestResponse(resp, RestStatus.Ok, responseData);
    }

    protected void doPatch(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Map<String, Object> responseData = new LinkedHashMap<>();
        responseData.put("method", "PATCH");
        responseData.put("receivedParams", getRequestParameters(req));
        responseData.put("receivedBody", parseBody(req));
        responseData.put("contentType", req.getContentType());
        responseData.put("timestamp", new Date().toString());
        responseData.put("message", "PATCH-запит успішно оброблено (часткове оновлення даних)");

        sendRestResponse(resp, RestStatus.Ok, responseData);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Map<String, Object> responseData = new LinkedHashMap<>();
        responseData.put("method", "DELETE");
        responseData.put("receivedParams", getRequestParameters(req));
        responseData.put("receivedBody", parseBody(req));
        responseData.put("timestamp", new Date().toString());
        responseData.put("message", "DELETE-запит успішно виконано (видалення ресурсу)");

        sendRestResponse(resp, RestStatus.Ok, responseData);
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Allow", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");

        Map<String, Object> responseData = new LinkedHashMap<>();
        responseData.put("method", "OPTIONS");
        responseData.put("allowedMethods", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD");
        responseData.put("timestamp", new Date().toString());
        responseData.put("message", "OPTIONS-запит успішно оброблено");

        sendRestResponse(resp, RestStatus.Ok, responseData);
    }

    @Override
    protected void doHead(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("X-Tested-Method", "HEAD");
        resp.setHeader("X-Server-Timestamp", String.valueOf(System.currentTimeMillis()));
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private Map<String, String> getRequestParameters(HttpServletRequest req) {
        Map<String, String> params = new LinkedHashMap<>();
        req.getParameterMap().forEach((k, v) -> {
            if (v != null && v.length > 0) {
                params.put(k, String.join(", ", v));
            }
        });
        return params;
    }

    private Object parseBody(HttpServletRequest req) {
        try {
            String rawBody;
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(req.getInputStream(), StandardCharsets.UTF_8))) {
                rawBody = reader.lines().collect(Collectors.joining("\n"));
            }
            if (rawBody == null || rawBody.trim().isEmpty()) {
                return null;
            }
            try {
                return JsonParser.parseString(rawBody);
            } catch (Exception e) {
                return rawBody;
            }
        } catch (Exception ex) {
            return "Error reading body: " + ex.getMessage();
        }
    }

    private void sendRestResponse(HttpServletResponse resp, RestStatus status, Object data) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");
        resp.setStatus(status.getCode());
        RestResponse restResponse = new RestResponse(status, data);
        resp.getWriter().print(gson.toJson(restResponse));
    }
}
