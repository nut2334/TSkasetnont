import React from "react";
import { useState, useEffect } from "react";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import * as config from "../config/config";

interface Category {
  category_id: string;
  category_name: string;
}

const DropdownCatagory = (prop: {
  handleCategoryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}) => {
  const apiCategories = config.getApiEndpoint("categories", "GET");

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    console.log(prop.value);

    const fetchData = async () => {
      const response = await axios.get(apiCategories);
      const data: Category[] = await response.data;
      setCategories(data);
    };
    fetchData();
  }, []);

  return (
    <TextField
      id="outlined-select-currency"
      select
      label="หมวดหมู่สินค้า"
      value={prop.value}
      defaultValue={categories.length > 0 ? categories[0].category_name : ""}
      fullWidth
      onChange={prop.handleCategoryChange}
      required
    >
      {categories.map((option) => (
        <MenuItem key={option.category_id} value={option.category_id}>
          {option.category_name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DropdownCatagory;
