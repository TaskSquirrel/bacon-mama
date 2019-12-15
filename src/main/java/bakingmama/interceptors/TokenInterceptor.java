package bakingmama.interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import bakingmama.util.ResponseUtils;
import bakingmama.util.TokenUtils;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

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
        String token = request.getHeader("Authorization");

        if (!request.getMethod().equals("POST")) {
            return true;
        }

        try {
            TokenUtils.UserToken check = TokenUtils.verifyAndDecode(token);

            LoggerFactory.getLogger(LoggerFactory.class).info(check.getUserName());
            LoggerFactory.getLogger(LoggerFactory.class).info(check.getUserID());

            request.setAttribute("userID", check.getUserID());
            request.setAttribute("userName", check.getUserName());
        } catch (JWTVerificationException e) {
            ResponseUtils.write(response, "error", "Authorization token invalid!");

            return false;
        } catch (Exception e) {
            ResponseUtils.write(response, "error", e.getMessage());

            return false;
        }

        return true;
    }
}