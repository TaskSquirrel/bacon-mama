package bakingmama.interceptors;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class InterceptorConfig extends WebMvcConfigurerAdapter {

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new TokenInterceptor()).addPathPatterns("/api/addRecipe");
		registry.addInterceptor(new TokenInterceptor()).addPathPatterns("/api/editRecipe");
		registry.addInterceptor(new TokenInterceptor()).addPathPatterns("/api/deleteRecipe");
		registry.addInterceptor(new TokenInterceptor()).addPathPatterns("/api/addStep");
		registry.addInterceptor(new TokenInterceptor()).addPathPatterns("/api/editStep");
		registry.addInterceptor(new TokenInterceptor()).addPathPatterns("/api/deleteStep");
		registry.addInterceptor(new TokenInterceptor()).addPathPatterns("/api/addIngredient");
		registry.addInterceptor(new TokenInterceptor()).addPathPatterns("/api/editIngredient");
		registry.addInterceptor(new TokenInterceptor()).addPathPatterns("/api/deleteIngredient");
		registry.addInterceptor(new TokenInterceptor()).addPathPatterns("/api/validateID");
	}
}