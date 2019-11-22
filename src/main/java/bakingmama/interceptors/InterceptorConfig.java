package bakingmama.interceptors;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class InterceptorConfig extends WebMvcConfigurerAdapter {

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new TokenInterceptor())
				.addPathPatterns("/api/addRecipe")
				.addPathPatterns("/api/editRecipe")
				.addPathPatterns("/api/deleteRecipe")
				.addPathPatterns("/api/addStep")
				.addPathPatterns("/api/editStep")
				.addPathPatterns("/api/deleteStep")
				.addPathPatterns("/api/addIngredient")
				.addPathPatterns("/api/editIngredient")
				.addPathPatterns("/api/deleteIngredient")
				.addPathPatterns("/api/validate");
	}
}