import React from 'react'
import { useState, useEffect } from "react";
import { TextField, MenuItem } from '@mui/material'
import axios from 'axios'

interface Category {
    category_id: string;
    category_name: string;
  }

const DropdownCatagory = (prop:{handleCategoryChange:(event: React.ChangeEvent<HTMLInputElement>)=>void}) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          const response = await axios.get("http://localhost:3001/categories");
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
                defaultValue={
                  categories.length > 0 ? categories[0].category_name : ""
                }
                fullWidth
                onChange={prop.handleCategoryChange}
              >
                {categories.map((option) => (
                  <MenuItem
                    key={option.category_id}
                    value={option.category_name}
                  >
                    {option.category_name}
                  </MenuItem>
                ))}
    </TextField>
  )
}

export default DropdownCatagory
