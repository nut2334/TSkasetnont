import React, { useEffect } from 'react'
import SearchBar from '../components/searchbar'
import { styled, alpha } from '@mui/material/styles';
import { Typography, TextField, MenuItem } from '@mui/material';
import { Container, Grid, Button, Card, CardMedia, CardContent, CardActions } from '@mui/material'
import { useSearchParams } from 'react-router-dom';

import * as config from "../config/config";
import axios from 'axios';

const SearchSection = styled('div')`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 10px;
    @media (min-width: 600px) {
        padding: 0 20px;
    }
`

interface sortInterface {
    title: string;
    type: "date" | "price" | "viewed";
}

const sortType = [
    {
        "title": "สินค้าล่าสุด",
        "type": "date"
    },
    {
        "title": "ราคา",
        "type": "price"
    },
    {
        "title": "ยอดเข้าชม",
        "type": "viewed"
    }
] as sortInterface[]

const Cateagory = styled('div')`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 15%;
    background-color: #f5f5f5;
    align-items: center;
    padding: 0 10px;
    @media (min-width: 600px) {
        padding: 20px;
    }
`

interface CateagoryInterface {
    category_id: string;
    category_name: string;
}

const ListProduct = () => {
    const [searchContent, setSearchContent] = React.useState("");
    const [sortBy, setSortBy] = React.useState<"date" | "price" | "viewed">("date");
    const [order, setOrder] = React.useState<"asc" | "desc">("desc");
    const [allCategory, setAllCategory] = React.useState<CateagoryInterface[]>([]);
    const [selectedCategory, setSelectedCategory] = React.useState<CateagoryInterface>({
        category_id: "",
        category_name: "all"
    });
    const [page, setPage] = React.useState("1");
    const [searchParams, setSearchParams] = useSearchParams();

    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const ip = config.ip;
    const port = config.port;
    useEffect(() => {
        axios.get(`http://${ip}:${port}/categories`)
            .then
            ((res) => {
                console.log(res.data);

                setAllCategory(res.data);
            })
    }, [])

    useEffect(() => {
        setSearchParams({ ["category"]: selectedCategory.category_name, ["sort"]: sortBy, ["order"]: order, ["page"]: page });
    }, [selectedCategory, sortBy, order])

    return (

        <div style={{ display: 'flex', flexDirection: "column" }}>
            <SearchSection>
                <div style={{ width: "50%", margin: "20px auto" }}>
                    <SearchBar placeholder="ค้นหาสินค้า" setSearchContent={setSearchContent} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {sortType.map((item, index) => {
                        return (
                            <Typography style={{ margin: "0 10px", padding: '0 10px', cursor: 'pointer' }} key={index} onClick={() => setSortBy(item.type)}>{item.title}</Typography>
                        )
                    })}
                    <div>
                        <TextField select defaultValue={order}
                            style={{ padding: '10px', margin: '0 10px' }}
                            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                        >
                            <MenuItem value="desc">เรียงลำดับ: มากไปน้อย</MenuItem>
                            <MenuItem value="asc">เรียงลำดับ: น้อยไปมาก</MenuItem>
                        </TextField>
                    </div>
                </div>

            </SearchSection>
            {selectedCategory && <Typography variant="h5">{selectedCategory.category_name}</Typography>}
            {searchContent} {sortBy} {order}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Cateagory>
                    <Typography variant="h5">
                        หมวดหมู่
                    </Typography>
                    {allCategory.map((item, index) => {
                        return (
                            <Typography key={index} style={{ margin: "5px 0", padding: '5px', cursor: 'pointer' }}
                                onClick={() => setSelectedCategory(item)}
                            >{item.category_name}</Typography>
                        )
                    }
                    )}
                </Cateagory>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {cards.map((card) => (
                            <Grid item key={card} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            // 16:9
                                            pt: '56.25%',
                                        }}
                                        image="https://source.unsplash.com/random?wallpapers"
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            Heading
                                        </Typography>
                                        <Typography>
                                            This is a media card. You can use this section to describe the
                                            content.
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">View</Button>
                                        <Button size="small">Edit</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </div>
        </div>
    )
}

export default ListProduct
