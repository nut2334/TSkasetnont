import React from 'react'
import { Container, Grid, Button, Card, CardMedia, CardContent, Typography, CardActions } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { NavLink } from 'react-router-dom';

const Myproducts = () => {
    const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <Container component="main" maxWidth="md">
    <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
    <Button variant="contained" color='secondary' startIcon={<SearchIcon />} style={{ marginRight: '8px' }}>ค้นหา</Button>
    <NavLink to="/addproduct">
    <Button variant="contained" color='primary' startIcon={<AddIcon />}>เพิ่มสินค้า</Button>
    </NavLink>
    </Grid>
    </Grid>
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
    </Container>
    )
}

export default Myproducts
