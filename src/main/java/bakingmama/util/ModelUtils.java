package bakingmama.util;

import bakingmama.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Wrapper for all the repository objects --
 *
 * Mainly consists of creation methods.
 */
@Component
public class ModelUtils {
  @Autowired
  UserRepository userRepository;
  @Autowired
  RecipeRepository recipeRepository;
  @Autowired
  StepRepository stepRepository;
  @Autowired
  ItemRepository itemRepository;
  @Autowired
  IngredientRepository ingredientRepository;
  @Autowired
  CourseRepository courseRepository;

  public Recipe addRecipe(User user, String name, String description) {
    Recipe recipe = new Recipe();
    recipe.setUser(user);
    recipe.setRecipeName(name);
    recipe.setDescription(description);
    recipeRepository.save(recipe);
    return recipe;
  }

  public Recipe editRecipe(Recipe recipe, String name, String description)
  {
    recipe.setRecipeName(name);
    recipe.setDescription(description);
    recipeRepository.save(recipe);
    return recipe;
  }

  public boolean deleteRecipe(Recipe recipe)
  {
    Set<Step> steps = recipe.getSteps();
    for(Step step : steps)
    {
      Set<Ingredient> ingredients= step.getIngredients();
      Ingredient result = step.getResultIngredient();
      if(result != null)
      {
        ingredientRepository.delete(result);
      }
      for(Ingredient ingredient : ingredients)
      {
        ingredientRepository.delete(ingredient);
      }
    }
    recipeRepository.delete(recipe);
    return true;
  }

  public Item addItem(String itemName, Image image, User creator) {
    Item item = new Item();
    item.setItemName(itemName);
    item.setImage(image);
    item.setCreator(creator);
    itemRepository.save(item);
    return item;
  }

  public Ingredient addIngredient(Item item, Step step, Double amount, String unit) {
    Ingredient ingredient = new Ingredient();
    ingredient.setItem(item);
    ingredient.setStep(step);
    ingredient.setAmount(amount);
    ingredient.setUnit(unit);
    ingredientRepository.save(ingredient);
    return ingredient;
  }

  public Step addStep(Recipe recipe, Ingredient result, String verb, Integer sequence, String description, Set<Ingredient> ingredientSet, String title) {
    Step step = new Step();
    step.setRecipe(recipe);
    step.setResultIngredient(result);
    step.setVerb(verb);
    step.setSequence(sequence);
    step.setDescription(description);
    step.setIngredients(ingredientSet);
    step.setTitle(title);
    stepRepository.save(step);
    return step;
  }

  public Course addCourse(User professor, String courseName)
  {
    Course newCourse = new Course();
    newCourse.setProfessor(professor);
    newCourse.setCourseName(courseName);
    courseRepository.save(newCourse);
    Set<Course> profCourses = professor.getCourses();
    profCourses.add(newCourse);
    professor.setCourses(profCourses);
    userRepository.save(professor);
    return newCourse;
  }

  public Course editCourse(Course course, String courseName)
  {
    course.setCourseName(courseName);
    courseRepository.save(course);
    return course;
  }

  public Course addStudentToCourse(Course course, User student)
  {
    Set<User> students = course.getStudents();
    students.add(student);
    course.setStudents(students);
    courseRepository.saveAndFlush(course);

    Set<Course> courses = student.getCourses();
    courses.add(course);
    student.setCourses(courses);
    userRepository.saveAndFlush(student);

    return course;
  }

  public Course removeStudentFromCourse(Course course, User student)
  {
    Set<User> students = course.getStudents();
    students.remove(student);
    course.setStudents(students);
    courseRepository.saveAndFlush(course);

    Set<Course> courses = student.getCourses();
    courses.remove(course);
    student.setCourses(courses);
    userRepository.saveAndFlush(student);

    return course;
  }

  public Course addRecipeToCourse(Course course, Recipe recipe)
  {
    Set<Recipe> recipes = course.getRecipes();
    recipes.add(recipe);
    course.setRecipes(recipes);
    courseRepository.save(course);
    return course;
  }

  public Course removeRecipeFromCourse(Course course, Recipe recipe)
  {
    Set<Recipe> recipes = course.getRecipes();
    recipes.remove(recipe);
    course.setRecipes(recipes);
    courseRepository.save(course);
    return course;
  }

  public void deleteCourse(Course course)
  {
    Set<User> students = course.getStudents();
    for(User student : students)
    {
      Set<Course> courses = student.getCourses();
      courses.remove(course);
      student.setCourses(courses);
      userRepository.saveAndFlush(student);
    }

    User prof = course.getProfessor();
    Set<Course> profCourses = prof.getCourses();
    profCourses.remove(course);
    prof.setCourses(profCourses);
    userRepository.saveAndFlush(prof);

    courseRepository.delete(course);
  }
}
