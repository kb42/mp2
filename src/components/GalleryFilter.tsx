import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { getAreas, getCategories } from "../api/meals";
import "./GalleryFilter.css";

interface GalleryFilterProps {
  selectedAreas: string[];
  selectedCategories: string[];
  onAreasChange: (areas: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
}

export default function GalleryFilter({
  selectedAreas,
  selectedCategories,
  onAreasChange,
  onCategoriesChange,
}: GalleryFilterProps) {
  const [areas, setAreas] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function loadFilters() {
      const [areasData, categoriesData] = await Promise.all([
        getAreas(),
        getCategories(),
      ]);
      setAreas(areasData);
      setCategories(categoriesData);
    }
    loadFilters();
  }, []);

  return (
    <Box className="gallery-filter-container">
      <Typography variant="h5" className="gallery-filter-title">
        Filter Meals!
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        className="gallery-filter-controls"
      >
        <FormControl className="gallery-filter-form-control">
          <InputLabel id="cuisine-label">Cuisine</InputLabel>
          <Select
            labelId="cuisine-label"
            multiple
            value={selectedAreas}
            onChange={(e) => onAreasChange(e.target.value as string[])}
            input={<OutlinedInput label="Cuisine" />}
            renderValue={(selected) => (
              <Box className="gallery-filter-chips-container">
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                className: "gallery-filter-menu-paper",
              },
            }}
          >
            {areas.map((area) => (
              <MenuItem key={area} value={area}>
                {area}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="gallery-filter-form-control">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            multiple
            value={selectedCategories}
            onChange={(e) => onCategoriesChange(e.target.value as string[])}
            input={<OutlinedInput label="Category" />}
            renderValue={(selected) => (
              <Box className="gallery-filter-chips-container">
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                className: "gallery-filter-menu-paper",
              },
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
