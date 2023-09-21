import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
// @mui
import { Container, Dialog, Button, Stack, Typography, Box, Card, Link  } from '@mui/material';
// components
import { ProductList } from '../sections/@dashboard/profiling';
// mock
import PRODUCTS from '../_mock/products';


import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

export default function ProductsPage() {

  const [isDialogOpen1, setDialogOpen1] = useState(false);
  const [isDialogOpen2, setDialogOpen2] = useState(false);

  const dialogContent1 = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <h4 style={{ marginLeft: '20px' }}>Control No. : 000-000-001</h4>

  <input type="date" id="date" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Enter Faculty Name" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Enter Location/Room" style={{ marginLeft: '20px' }} />
  <br />
  
  <h4 style={{ marginLeft: '20px' }}>Select Services:</h4>
  <div style={{ marginLeft: '20px' }}>
   
      <input type="checkbox" value="Application Installation" /> Application Installation
    <br />
      <input type="checkbox" value="Network" /> Network
    <br />
      <input type="checkbox" value="Inventory" /> Inventory
    <br />
      <input type="checkbox" value="Reformat" /> Reformat
    <br />
      <input type="checkbox" value="Repair" /> Repair
       <br />
      <input type="checkbox" value="Others" /> Others 
    <br />
  
  </div>
  <br />
  <input type="text" placeholder="Enter Remarks" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Enter Requisitioner" style={{ marginLeft: '20px' }} />
  <br />
  <div>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <Button variant="contained" color="primary">
      Save
    </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

    <Button variant="contained" color="secondary">
      Clear
    </Button>
  </div>
</div>
  );

  const dialogContent2 = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <h4 style={{ marginLeft: '20px' }}>Control No. : 000-000-001</h4>

  <input type="date" id="date" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Enter Faculty Name" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Enter Location/Room" style={{ marginLeft: '20px' }} />
  <br />
  
  <h4 style={{ marginLeft: '20px' }}>Select Services:</h4>
  <div style={{ marginLeft: '20px' }}>
   
      <input type="checkbox" value="Application Installation" /> Application Installation
    <br />
      <input type="checkbox" value="Network" /> Network
    <br />
      <input type="checkbox" value="Inventory" /> Inventory
    <br />
      <input type="checkbox" value="Reformat" /> Reformat
    <br />
      <input type="checkbox" value="Repair" /> Repair
       <br />
      <input type="checkbox" value="Others" /> Others 
    <br />
  
  </div>
  <br />
  <input type="text" placeholder="Enter Remarks" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Enter Requisitioner" style={{ marginLeft: '20px' }} />
  <br />
  <div>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <Button variant="contained" color="primary">
      Save
    </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

    <Button variant="contained" color="secondary">
      Clear
    </Button>
  </div>
</div>
  );

  const openDialog1 = () => {
    setDialogOpen1(true);
  };

  const closeDialog1 = () => {
    setDialogOpen1(false);
  };
  
  const openDialog2 = () => {
    setDialogOpen2(true);
  };

  const closeDialog2 = () => {
    setDialogOpen2(false);
  };

  const handleTypographyClick1 = () => {
    openDialog1();
  };

  const handleTypographyClick2 = () => {
    openDialog2();
  };


  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);


  const StyledProductImg = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
  });

  const { name, cover} = PRODUCTS;
  

  return (
    <>
      <Helmet>
        <title>Profiling</title>
      </Helmet>

      <Container>
        <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
          Profiling
        </Typography>






        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* { <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            /> }
            { <ProductSort /> } */}
          </Stack>
        </Stack>

        {/* <ProductList products={PRODUCTS} /> */}
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
              <Typography
            variant="subtitle2"
            onClick={handleTypographyClick1}
            sx={{ cursor: 'pointer' }}
          >
            Total MR:
          </Typography>
        <Dialog open={isDialogOpen1} onClose={closeDialog1}>
          {dialogContent1}
        </Dialog>
              </Link>
            </Stack>
          </Card>

          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
              <Typography
            variant="subtitle2"
            onClick={handleTypographyClick2}
            sx={{ cursor: 'pointer' }}
          >
            Total CI:
          </Typography>
        
        <Dialog open={isDialogOpen2} onClose={closeDialog2}>
          {dialogContent2}
        </Dialog>
              </Link>
            </Stack>
          </Card>

          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
              <Typography
            variant="subtitle2"
            onClick={handleTypographyClick1}
            sx={{ cursor: 'pointer' }}
          >
            Total Profiling:
          </Typography>
        <Dialog open={isDialogOpen1} onClose={closeDialog1}>
          {dialogContent1}
        </Dialog>
              </Link>
            </Stack>
          </Card>

          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
              <Typography
            variant="subtitle2"
            onClick={handleTypographyClick1}
            sx={{ cursor: 'pointer' }}
          >
            Total Archived Profiling:
          </Typography>
        <Dialog open={isDialogOpen1} onClose={closeDialog1}>
          {dialogContent1}
        </Dialog>
              </Link>
            </Stack>
          </Card>

        </Stack>
      </Container>
    </>
  );
}
