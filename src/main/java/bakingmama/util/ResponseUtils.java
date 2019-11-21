package bakingmama.util;

import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

public class ResponseUtils {

    public static void write(HttpServletResponse response, Map<String, Object> o) throws Exception {
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        out.print(o);
        out.flush();
        out.close();
    }
}