<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String invalidPath = (String) request.getAttribute("invalidRoute");
    String appPath = request.getContextPath();
%>
<div class="admin-route-error" style="background: #fef2f2; border: 1.5px solid #ef4444; border-radius: 8px; padding: 22px; margin-top: 16px;">
    <h3 style="color: #b91c1c; margin-top: 0; font-size: 1.25rem;">&#9888; 404 &mdash; Внутрішній маршрут не знайдено</h3>
    <p style="color: #374151; font-size: 0.95rem;">Запитаний підрозділ панелі керування <code style="background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px;"><%= invalidPath != null ? invalidPath : "" %></code> не знайдено.</p>
    <p style="margin-bottom: 0;"><a href="<%= appPath %>/admin/" style="display: inline-block; padding: 6px 14px; background: #dc2626; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 500;">Повернутися до головного розділу</a></p>
</div>

