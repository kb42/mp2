import { useEffect, useState } from "react";
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
  Skeleton,
  Alert,
} from "@mui/material";
import { getRandomMeal } from "../api/meals";
import type { Meal, Ingredient } from "../types/meal";
import "./SurpriseMe.css";

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

export default function SurpriseMe() {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRandomMeal = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRandomMeal();
      setMeal(data);
    } catch (e) {
      setError("Failed to load random meal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomMeal();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" className="surprise-me-container">
        <Skeleton variant="rectangular" height={400} className="surprise-me-skeleton-image" />
        <Skeleton variant="text" height={60} />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" height={200} />
      </Container>
    );
  }

  if (error || !meal) {
    return (
      <Container maxWidth="md" className="surprise-me-container">
        <Alert severity="error" className="surprise-me-error-alert">
          {error || "Failed to load meal"}
        </Alert>
        <Button variant="contained" onClick={loadRandomMeal}>
          Try Again
        </Button>
      </Container>
    );
  }

  const ingredients = parseIngredients(meal);

  return (
    <Container maxWidth="md" className="surprise-me-container">
      <Box className="surprise-me-header">
        <Typography variant="h3" className="surprise-me-title">
          Surprise Me!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover a random delicious meal
        </Typography>
      </Box>

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

          <Stack direction="row" spacing={1} className="surprise-me-chips">
            <Chip label={meal.strCategory || "Unknown"} color="primary" />
            <Chip label={meal.strArea || "Unknown"} color="secondary" />
            <Chip label={`ID: ${meal.idMeal}`} variant="outlined" />
          </Stack>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            Instructions
          </Typography>
          <ol className="surprise-me-instructions">
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
          <Box className="surprise-me-ingredients-box">
            {ingredients.map((ing, idx) => (
              <Chip
                key={idx}
                label={`${ing.measure} ${ing.name}`}
                variant="outlined"
              />
            ))}
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={loadRandomMeal}
          >
            Surprise Me Again!
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
