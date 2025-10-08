import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  ImageList,
  ImageListItem,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getAllMeals } from "../api/meals";
import GalleryFilter from "../components/GalleryFilter";
import { useMealContext } from "../context/MealContext";
import type { Meal } from "../types/meal";
import "./Gallery.css";

export default function Gallery() {
  const navigate = useNavigate();
  const { setMealIds, setSource } = useMealContext();
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    async function loadMeals() {
      try {
        setLoading(true);
        const data = await getAllMeals();
        setAllMeals(data);
      } catch (e) {
        setError("Failed to load meals. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadMeals();
  }, []);

  const filteredMeals = useMemo(() => {
    if (selectedAreas.length === 0 && selectedCategories.length === 0) {
      return allMeals;
    }

    let filtered = allMeals;

    if (selectedAreas.length > 0) {
      filtered = filtered.filter((meal) =>
        selectedAreas.includes(meal.strArea || "")
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((meal) =>
        selectedCategories.includes(meal.strCategory || "")
      );
    }

    return filtered;
  }, [allMeals, selectedAreas, selectedCategories]);

  const handleMealClick = (mealId: string) => {
    const ids = filteredMeals.map((m) => m.idMeal);
    setMealIds(ids);
    setSource("gallery");
    navigate(`/detail/${mealId}`);
  };

  if (loading) {
    return (
      <Box className="gallery-loading-box">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container className="gallery-error-container">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="gallery-container">
      <Box className="gallery-header">
        <Typography variant="h3" className="gallery-title">
          Meal Gallery
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Browse and filter through our collection of delicious meals
        </Typography>
      </Box>

      <GalleryFilter
        selectedAreas={selectedAreas}
        selectedCategories={selectedCategories}
        onAreasChange={setSelectedAreas}
        onCategoriesChange={setSelectedCategories}
      />

      {filteredMeals.length === 0 && !loading && (
        <Alert severity="info" className="gallery-no-results">
          No meals match your filters. Try adjusting your selection.
        </Alert>
      )}

      <ImageList
        variant="masonry"
        cols={4}
        gap={16}
        className="gallery-image-list"
      >
        {filteredMeals.map((meal) => (
          <ImageListItem
            key={meal.idMeal}
            onClick={() => handleMealClick(meal.idMeal)}
            className="gallery-image-item"
          >
            <Box
              component="img"
              src={meal.strMealThumb}
              alt={meal.strMeal}
              loading="lazy"
              className="gallery-image"
            />
            <Box className="gallery-overlay">
              <Typography variant="h6" className="gallery-overlay-title">
                {meal.strMeal}
              </Typography>
              <Typography variant="body2" className="gallery-overlay-id">
                ID: {meal.idMeal}
              </Typography>
            </Box>
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
}
