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
  const [isDialogOpen4, setDialogOpen4] = useState(false);
  const [isDialogOpen5, setDialogOpen5] = useState(false);

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

  const dialogContent4 = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <h4 style={{ marginLeft: '20px' }}>Control No. : 000-000-001</h4>

  <input type="date" id="date" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Issue" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Description" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Action Taken" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Solution" style={{ marginLeft: '20px' }} />
  <br />
  
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

  const dialogContent5 = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <h4 style={{ marginLeft: '20px' }}>Control No. : 000-000-001</h4>

  <input type="date" id="date" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Issue" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Description" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Action Taken" style={{ marginLeft: '20px' }} />
  <br />
  <input type="text" placeholder="Solution" style={{ marginLeft: '20px' }} />
  <br />
  
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

  const openDialog4 = () => {
    setDialogOpen4(true);
  };

  const closeDialog4 = () => {
    setDialogOpen4(false);
  };

  const openDialog5 = () => {
    setDialogOpen4(true);
  };

  const closeDialog5 = () => {
    setDialogOpen5(false);
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

  const handleTypographyClick4 = () => {
    openDialog4();
  };

  const handleTypographyClick5 = () => {
    openDialog5();
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
     
      <Container sx={{ backgroundColor: '#F0EFF6', borderRadius: '10px', paddingBottom: '20px' }}>
      <Container>
        
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 0 }}>
        { <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> }
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* { <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            /> }
            { <ProductSort /> } */}
          </Stack>
        </Stack>
        <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff7200' }} >
          Forms
        </Typography>





        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1, flexWrap: 'wrap'}}>
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
            Total SRF:
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
                  Total BIF:
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
                  Total RIF:
                </Typography>
              </Link>
              <Dialog open={isDialogOpen3} onClose={closeDialog3}>
          {dialogContent3}
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
                onClick={handleTypographyClick4}
                sx={{ cursor: 'pointer' }}
                >
                  Total IRF:
                </Typography>
              </Link>
              <Dialog open={isDialogOpen4} onClose={closeDialog4}>
          {dialogContent4}
        </Dialog>
            </Stack>
          </Card>
          </Stack>
            </Container>
            
            <Container> 
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1, flexWrap: 'wrap'}}> 
          <Card sx={{ pt: '10%', height: '300px', width: '250px', position: 'relative'}}>
            <Box sx={{ pt: '10%', height: '100px', width: '100px', position: 'relative' }}>
              {/* <StyledProductImg alt={name} src={cover} /> */}
            </Box>
            <Stack spacing={2} sx={{ p: 3 }}>
              <Link color="inherit" underline="hover">
                <Typography variant="subtitle2"
                onClick={handleTypographyClick5}
                sx={{ cursor: 'pointer' }}
                >
                  Total Forms:
                </Typography>
              </Link>
              <Dialog open={isDialogOpen5} onClose={closeDialog5}>
          {dialogContent5}
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
                onClick={handleTypographyClick5}
                sx={{ cursor: 'pointer' }}
                >
                  Total Archived Forms:
                </Typography>
              </Link>
              <Dialog open={isDialogOpen5} onClose={closeDialog5}>
          {dialogContent5}
        </Dialog>
            </Stack>
          </Card>

        </Stack>
      </Container>
      </Container>
    </>
  );
}

