import { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  Breadcrumbs,
  Skeleton,
  Alert,
  Link,
} from "@mui/material";
import { getMealById } from "../api/meals";
import { useMealContext } from "../context/MealContext";
import type { Meal, Ingredient } from "../types/meal";
import "./MealDetail.css";

function parseIngredients(meal: Meal): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal];
    const measure = meal[`strMeasure${i}` as keyof Meal];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }
  return ingredients;
}

export default function MealDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mealIds, currentIndex, setCurrentIndex, source } = useMealContext();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMeal() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getMealById(id);
        if (!data) {
          setError("Meal not found");
        } else {
          setMeal(data);
          const index = mealIds.indexOf(id);
          if (index !== -1) {
            setCurrentIndex(index);
          }
        }
      } catch (e) {
        setError("Failed to load meal details");
      } finally {
        setLoading(false);
      }
    }
    loadMeal();
  }, [id, mealIds, setCurrentIndex]);

  const handlePrevious = () => {
    if (mealIds.length > 0 && currentIndex > 0) {
      navigate(`/detail/${mealIds[currentIndex - 1]}`);
    }
  };

  const handleNext = () => {
    if (mealIds.length > 0 && currentIndex < mealIds.length - 1) {
      navigate(`/detail/${mealIds[currentIndex + 1]}`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" className="meal-detail-container">
        <Skeleton variant="rectangular" height={400} className="meal-detail-skeleton-image" />
        <Skeleton variant="text" height={60} />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={200} />
      </Container>
    );
  }

  if (error || !meal) {
    return (
      <Container maxWidth="md" className="meal-detail-container">
        <Alert severity="error" className="meal-detail-error-alert">
          {error || "Meal not found"}
        </Alert>
        <Button variant="contained" component={RouterLink} to="/list">
          Back to List
        </Button>
      </Container>
    );
  }

  const ingredients = parseIngredients(meal);

  return (
    <Container maxWidth="md" className="meal-detail-container">
      <Breadcrumbs className="meal-detail-breadcrumbs">
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Link
          component={RouterLink}
          to={source === "gallery" ? "/gallery" : "/list"}
          underline="hover"
          color="inherit"
        >
          {source === "gallery" ? "Gallery" : "List"}
        </Link>
        <Typography color="text.primary">{meal.strMeal}</Typography>
      </Breadcrumbs>

      <Card elevation={3}>
        <CardMedia
          component="img"
          height="400"
          image={meal.strMealThumb}
          alt={meal.strMeal}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            {meal.strMeal}
          </Typography>

          <Stack direction="row" spacing={1} className="meal-detail-chips">
            <Chip label={meal.strCategory || "Unknown"} color="primary" />
            <Chip label={meal.strArea || "Unknown"} color="secondary" />
            <Chip label={`ID: ${meal.idMeal}`} variant="outlined" />
          </Stack>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            Instructions
          </Typography>
          <ol className="meal-detail-instructions">
            {(meal.strInstructions || "No instructions available")
              .split(/\.\s+/)
              .filter(s => s.trim())
              .map((step, i) => (
                <li key={i}>{step.trim()}{step.endsWith('.') ? '' : '.'}</li>
              ))}
          </ol>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            Ingredients
          </Typography>
          <Box className="meal-detail-ingredients-box">
            {ingredients.map((ing, idx) => (
              <Chip
                key={idx}
                label={`${ing.measure} ${ing.name}`}
                variant="outlined"
              />
            ))}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={!mealIds.length || currentIndex === 0}
            >
              ← Previous
            </Button>
            <Button
              variant="outlined"
              onClick={handleNext}
              disabled={
                !mealIds.length || currentIndex === mealIds.length - 1
              }
            >
              Next →
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
