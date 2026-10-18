package step.learning.java231web.servlets;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import step.learning.java231web.data.dao.ProductSectionDao;
import step.learning.java231web.data.dto.Product;
import step.learning.java231web.data.dto.ProductSection;
import step.learning.java231web.rest.RestPagination;
import step.learning.java231web.rest.RestResponse;
import step.learning.java231web.rest.RestStatus;

@Singleton
public class ProductSectionServlet extends HttpServlet {
    private final ProductSectionDao productSectionDao;
    private final Gson gson;

    @Inject
    public ProductSectionServlet(ProductSectionDao productSectionDao) {
        this.productSectionDao = productSectionDao;
        this.gson = new GsonBuilder().serializeNulls().create();
    }

    public ProductSectionServlet(ProductSectionDao productSectionDao, Gson gson) {
        this.productSectionDao = productSectionDao;
        this.gson = gson != null ? gson : new GsonBuilder().serializeNulls().create();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");

        if (productSectionDao != null) {
            productSectionDao.ensureInstalled();
        }

        String pathInfo = req.getPathInfo();
        String slug = null;
        if (pathInfo != null && !pathInfo.trim().isEmpty() && !pathInfo.equals("/")) {
            slug = pathInfo.trim();
            if (slug.startsWith("/")) {
                slug = slug.substring(1);
            }
            if (slug.endsWith("/")) {
                slug = slug.substring(0, slug.length() - 1);
            }
        }

        int page = 1;
        int perPage = 10;

        String pageParam = req.getParameter("page");
        if (pageParam != null && !pageParam.trim().isEmpty()) {
            try {
                page = Integer.parseInt(pageParam.trim());
                if (page < 1) {
                    sendRest(req, resp, HttpServletResponse.SC_BAD_REQUEST, RestStatus.QueryParameterMalformed,
                            "Query parameter 'page' must be greater than 0", null, "object");
                    return;
                }
            } catch (NumberFormatException ex) {
                sendRest(req, resp, HttpServletResponse.SC_BAD_REQUEST, RestStatus.QueryParameterMalformed,
                        "Query parameter 'page' must be a valid integer", null, "object");
                return;
            }
        }

        String perPageParam = req.getParameter("pageSize");
        if (perPageParam == null || perPageParam.trim().isEmpty()) {
            perPageParam = req.getParameter("perPage");
        }
        if (perPageParam == null || perPageParam.trim().isEmpty()) {
            perPageParam = req.getParameter("size");
        }
        if (perPageParam != null && !perPageParam.trim().isEmpty()) {
            try {
                perPage = Integer.parseInt(perPageParam.trim());
                if (perPage < 1) {
                    sendRest(req, resp, HttpServletResponse.SC_BAD_REQUEST, RestStatus.QueryParameterMalformed,
                            "Query parameter 'pageSize' must be greater than 0", null, "object");
                    return;
                }
            } catch (NumberFormatException ex) {
                sendRest(req, resp, HttpServletResponse.SC_BAD_REQUEST, RestStatus.QueryParameterMalformed,
                        "Query parameter 'pageSize' must be a valid integer", null, "object");
                return;
            }
        }

        RestPagination pagination = new RestPagination(page, perPage, 0);

        try {
            if (slug == null || slug.isEmpty()) {
                // Запит усіх розділів
                long total = productSectionDao.getSectionsCount();
                pagination.setTotal((int) total);
                List<ProductSection> sections = productSectionDao.getSections(pagination);
                sendRest(req, resp, HttpServletResponse.SC_OK, RestStatus.Ok, sections, pagination, "array");
            } else {
                // Запит конкретного розділу за слагом з каскадом товарів
                ProductSection section = productSectionDao.getSectionBySlug(slug, pagination);
                if (section == null) {
                    sendRest(req, resp, HttpServletResponse.SC_NOT_FOUND, RestStatus.NotFound, "Section not found", null, "object");
                    return;
                }

                long totalProducts = productSectionDao.getProductsCountBySectionSlug(slug);
                pagination.setTotal((int) totalProducts);
                sendRest(req, resp, HttpServletResponse.SC_OK, RestStatus.Ok, section, pagination, "object");
            }
        } catch (SQLException ex) {
            sendRest(req, resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, RestStatus.DatabaseError,
                    ex.getMessage(), null, "object");
        } catch (Exception ex) {
            sendRest(req, resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, RestStatus.InternalServerError,
                    ex.getMessage(), null, "object");
        }
    }

    private void sendRest(HttpServletRequest req, HttpServletResponse resp, int httpStatusCode, RestStatus status, Object data, RestPagination pagination, String dataType) throws IOException {
        resp.setStatus(httpStatusCode);
        resp.setContentType("application/json; charset=UTF-8");

        String baseUrl = (req != null && req.getServerName() != null)
                ? req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + req.getContextPath()
                : "http://localhost:8080/java231web";

        adjustMediaUrls(data, baseUrl);

        RestResponse restResponse = new RestResponse(status, data);
        if (restResponse.getMeta() != null) {
            restResponse.getMeta().setServiceName("API 'Product Sections'");
            restResponse.getMeta().setDataType(dataType);
            restResponse.getMeta().setManipulations(Arrays.asList("GET"));
        }
        if (pagination != null) {
            restResponse.setPagination(pagination);
        }
        resp.getWriter().print(gson.toJson(restResponse));
    }

    @SuppressWarnings("unchecked")
    private void adjustMediaUrls(Object responseData, String hostUrl) {
        if (responseData instanceof List) {
            for (Object item : (List<?>) responseData) {
                if (item instanceof ProductSection) {
                    adjustSectionMedia((ProductSection) item, hostUrl);
                }
            }
        } else if (responseData instanceof ProductSection) {
            adjustSectionMedia((ProductSection) responseData, hostUrl);
        }
    }

    private void adjustSectionMedia(ProductSection sectionNode, String hostUrl) {
        if (sectionNode == null) return;
        sectionNode.setImageUrl(formatStorageUrl(sectionNode.getImageUrl(), hostUrl));
        if (sectionNode.getProducts() != null) {
            for (Product prod : sectionNode.getProducts()) {
                prod.setImageUrl(formatStorageUrl(prod.getImageUrl(), hostUrl));
            }
        }
        if (sectionNode.getChildren() != null) {
            for (ProductSection subSection : sectionNode.getChildren()) {
                adjustSectionMedia(subSection, hostUrl);
            }
        }
    }

    private String formatStorageUrl(String rawPath, String hostUrl) {
        if (rawPath == null || rawPath.trim().isEmpty() || "null".equalsIgnoreCase(rawPath.trim())) {
            return null;
        }
        if (rawPath.startsWith("http://localhost:8080/") || rawPath.startsWith("http://127.0.0.1:8080/")) {
            return rawPath;
        }
        String fileName = rawPath;
        int sepIdx = fileName.lastIndexOf('/');
        if (sepIdx >= 0) {
            fileName = fileName.substring(sepIdx + 1);
        }
        return hostUrl + "/storage/" + fileName;
    }
}
