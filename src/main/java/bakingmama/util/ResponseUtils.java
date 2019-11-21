package bakingmama.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletResponse;

public class ResponseUtils {
    public static void setHeaders(HttpServletResponse response) {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
    }

    public static void write(HttpServletResponse response, String status, String message) throws Exception {
        PrintWriter out = response.getWriter();

        ObjectMapper om = new ObjectMapper();
        ObjectNode on = om.createObjectNode();
        on.put(status, message);

        out.print(on.toString());
        out.flush();
        out.close();
    }
}