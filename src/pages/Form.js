import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Dialog, Button, Stack, Typography, Box, Card, Link } from '@mui/material';
// components
import { ProductList } from '../sections/@dashboard/form';
// mock
import FORMS from '../_mock/forms';


import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);

  const [isDialogOpen1, setDialogOpen1] = useState(false);
  const [isDialogOpen2, setDialogOpen2] = useState(false);
  const [isDialogOpen3, setDialogOpen3] = useState(false);

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
  
  <h4 style={{ marginLeft: '20px' }}>Select Items:</h4>
  <div style={{ marginLeft: '20px' }}>
   
      <input type="checkbox" value="HDMI" /> HDMI
    <br />
      <input type="checkbox" value="TV" /> TV
    <br />
      <input type="checkbox" value="Projector" /> Projector
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

  const dialogContent3 = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <h4 style={{ marginLeft: '20px' }}>Control No. : 000-000-001</h4>

  <input type="date" id="date" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Enter Faculty Name" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Enter Location/Room" style={{ marginLeft: '20px' }} />
  <br />
  
  <h4 style={{ marginLeft: '20px' }}>Select Items:</h4>
  <div style={{ marginLeft: '20px' }}>
   
      <input type="checkbox" value="Mouse" /> Mouse
    <br />
      <input type="checkbox" value="Keyboard" /> Keyboard
    <br />
      <input type="checkbox" value="Monitor" /> Monitor
    <br />
      <input type="checkbox" value="AVR" /> AVR
    <br />
      <input type="checkbox" value="CPU" /> CPU
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

  const openDialog3 = () => {
    setDialogOpen3(true);
  };

  const closeDialog3 = () => {
    setDialogOpen3(false);
  };

  const handleTypographyClick1 = () => {
    openDialog1();
  };

  const handleTypographyClick2 = () => {
    openDialog2();
  };

  const handleTypographyClick3 = () => {
    openDialog3();
  };



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
        <title>Forms</title>
      </Helmet>

      <Container>
        <Typography variant="h2" sx={{ mb: 5 }}>
          Forms
        </Typography>


        



        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
        {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            /> */}
            {/* <ProductSort /> */}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={3} flexShrink={0} sx={{ my: 1 }}>
        <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative' }}>
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
            Service Request Form
          </Typography>
        </Link>
        <Dialog open={isDialogOpen1} onClose={closeDialog1}>
          {dialogContent1}
        </Dialog>
      </Stack>
    </Card>

    
          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
                <Typography variant="subtitle2"
                onClick={handleTypographyClick2}
                sx={{ cursor: 'pointer' }}
                >
                  Borrowers Item Form
                </Typography>
              </Link>
              <Dialog open={isDialogOpen2} onClose={closeDialog2}>
          {dialogContent2}
        </Dialog>
            </Stack>
          </Card>

          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
                <Typography variant="subtitle2"
                onClick={handleTypographyClick3}
                sx={{ cursor: 'pointer' }}
                >
                  Request Item Forms 
                </Typography>
              </Link>
              <Dialog open={isDialogOpen3} onClose={closeDialog3}>
          {dialogContent3}
        </Dialog>
            </Stack>
          </Card>

        </Stack>
      </Container>
    </>
  );
}

