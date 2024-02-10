import React from 'react'
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10px',
    [theme.breakpoints.up('sm')]: {
        padding: '0 20px',
    },
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.10),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
    },
}));

const SearchBar = (prop: { placeholder: string, setSearchContent: React.Dispatch<React.SetStateAction<string>>; }) => {
    const [search, setSearch] = React.useState("");
    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder={prop.placeholder}
                onChange={(e) => {
                    setSearch(e.target.value);
                }}

                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        prop.setSearchContent(search);
                    }
                }
                }
            />
            {/* button click to search */}
            <button
                onClick={() => {
                    prop.setSearchContent(search);
                }}
            >search</button>

        </Search>
    )
}

export default SearchBar
