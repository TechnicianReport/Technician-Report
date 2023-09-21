import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Dialog, Button, Stack, Typography, Box, Card, Link  } from '@mui/material';
// components
import { ProductList } from '../sections/@dashboard/report';
// mock
import REPORTS from '../_mock/reports';


import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

export default function ProductsPage() {
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

  return (
    <>
      <Helmet>
        <title>Reports</title>
      </Helmet>

      <Container>
      <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
          Reports
        </Typography>


        



        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
        { <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> }
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            /> */}
            {/* <ProductSort /> */}
          </Stack>
        </Stack>


        {/* <ProductList reports={REPORTS} /> */}

        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1, flexWrap: 'wrap'}}>
        <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative' }}>
      <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
        {/* <StyledProductImg alt={name} src={cover} /> */}
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
          >
            Total PTR:
          </Typography>
        </Link>
      </Stack>
    </Card>

    
    <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative' }}>
      <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
        {/* <StyledProductImg alt={name} src={cover} /> */}
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
          >
            Total ITR:
          </Typography>
        </Link>
      </Stack>
    </Card>

    <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative' }}>
      <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
        {/* <StyledProductImg alt={name} src={cover} /> */}
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
          >
            Total MAR:
          </Typography>
        </Link>
      </Stack>
    </Card>
      

    <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative' }}>
      <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
        {/* <StyledProductImg alt={name} src={cover} /> */}
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
          >
            Total ILF:
          </Typography>
        </Link>
      </Stack>
    </Card>
          </Stack>

        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1, flexWrap: 'wrap'}}>
        <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative' }}>
      <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
        {/* <StyledProductImg alt={name} src={cover} /> */}
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
          >
            Total Reports:
          </Typography>
        </Link>
      </Stack>
    </Card>

    <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative' }}>
      <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
        {/* <StyledProductImg alt={name} src={cover} /> */}
      </Box>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
          >
            Total Archived Reports:
          </Typography>
        </Link>
      </Stack>
    </Card>

        </Stack>

      </Container>
    </>
  );
}
