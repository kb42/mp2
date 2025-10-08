import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Container,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { searchMealsByName } from "../api/meals";
import { useMealContext } from "../context/MealContext";
import type { Meal } from "../types/meal";
import "./MealList.css";

type SortField = "name" | "id";
type SortOrder = "asc" | "desc";

export default function MealListMUI() {
  const navigate = useNavigate();
  const { setMealIds, setSource } = useMealContext();
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    if (!query.trim()) {
      setMeals([]);
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await searchMealsByName(query.trim());
        setMeals(data);
      } catch (e: any) {
        if (e.name !== 'AbortError' && e.name !== 'CanceledError') {
          setError("Failed to fetch meals. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const sortedMeals = useMemo(() => {
    const sorted = [...meals].sort((a, b) => {
      let compareA: string;
      let compareB: string;

      if (sortField === "name") {
        compareA = a.strMeal.toLowerCase();
        compareB = b.strMeal.toLowerCase();
      } else {
        compareA = a.idMeal;
        compareB = b.idMeal;
      }

      if (sortOrder === "asc") {
        return compareA.localeCompare(compareB);
      } else {
        return compareB.localeCompare(compareA);
      }
    });
    return sorted;
  }, [meals, sortField, sortOrder]);

  const handleMealClick = (mealId: string) => {
    const ids = sortedMeals.map((m) => m.idMeal);
    setMealIds(ids);
    setSource("list");
    navigate(`/detail/${mealId}`);
  };

  return (
    <Container className="meal-list-container">
      <Stack spacing={2} className="meal-list-search-stack">
        <TextField
          label="Search meals"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="small"
          fullWidth
          placeholder="Type to search..."
        />

        <Stack direction="row" spacing={2} alignItems="center" className="meal-list-sort-controls">
          <FormControl size="small" className="meal-list-sort-select">
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortField}
              label="Sort by"
              onChange={(e) => setSortField(e.target.value as SortField)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="id">ID</MenuItem>
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={sortOrder}
            exclusive
            onChange={(_, newOrder) => newOrder && setSortOrder(newOrder)}
            size="small"
          >
            <ToggleButton value="asc">
              Asc
            </ToggleButton>
            <ToggleButton value="desc">
              Desc
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {loading && (
        <Box className="meal-list-loading-box">
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error" className="meal-list-error-alert">{error}</Alert>}

      {!loading && !error && meals.length === 0 && (
        <Alert severity="info">No results. Try a different term.</Alert>
      )}

      {!loading && !error && sortedMeals.length > 0 && (
        <Paper elevation={2}>
          <List className="meal-list-results">
            {sortedMeals.map((m, index) => (
              <div key={m.idMeal}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => handleMealClick(m.idMeal)}
                  className="meal-list-item"
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={m.strMealThumb}
                      alt={m.strMeal}
                      className="meal-list-avatar"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div">
                        {m.strMeal}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={0.5} className="meal-list-secondary-text">
                        <Typography variant="body2" color="text.secondary">
                          <strong>ID:</strong> {m.idMeal}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Category:</strong> {m.strCategory ?? "Unknown"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Cuisine:</strong> {m.strArea ?? "Unknown"}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                {index < sortedMeals.length - 1 && <Divider variant="inset" component="li" />}
              </div>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}
