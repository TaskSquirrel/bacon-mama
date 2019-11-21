package bakingmama.interceptors;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import bakingmama.util.JsonUtils;
import bakingmama.util.ResponseUtils;
import bakingmama.util.TokenUtils;

public class TokenInterceptor extends HandlerInterceptorAdapter {

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception)
    throws Exception { }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)
    throws Exception { }

    @Override
    public boolean preHandle(
        HttpServletRequest request,
        HttpServletResponse response,
        Object handler
    ) throws Exception {
        HandlerMethod handlerMethod = (HandlerMethod) handler;

        String token = request.getHeader("Authorization");
        String check = TokenUtils.verifyToken(token);

        ResponseUtils.setHeaders(response);
        if (!check.equals("true")) {
            ResponseUtils.write(response, JsonUtils.ERROR, check);
            return false;
        }

        // response.setHeader(JsonUtils.STATUS, JsonUtils.SUCCESS);
        return true;
    }
}