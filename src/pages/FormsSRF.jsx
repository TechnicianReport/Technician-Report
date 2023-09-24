import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, onSnapshot, doc, getDocs, where, updateDoc, deleteDoc, addDoc, getDoc, documentId } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';


// @mui
import {Card,Table,Stack,Paper,Avatar,Popover,Checkbox,TableRow,
        MenuItem,TableBody,TableCell,Container,Typography,IconButton,TableContainer,
        TablePagination,Dialog, DialogTitle, DialogContent, DialogActions, Button, 
        Backdrop, Snackbar, TableHead, CircularProgress, TextField} from '@mui/material';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

const firebaseConfig = {
  apiKey: "AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc",
  authDomain: "wp4-technician-dms.firebaseapp.com",
  projectId: "wp4-technician-dms",
  storageBucket: "wp4-technician-dms.appspot.com",
  messagingSenderId: "1065436189229",
  appId: "1:1065436189229:web:88094d3d71b15a0ab29ea4"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore db
const db = getFirestore(firebaseApp);

// Access main collection
const mainCollectionRef = collection(db, "WP4-TECHNICIAN-DMS");

// Access FORMS document under main collection
const formsDocRef = doc(mainCollectionRef, "FORMS");

// Add to subcollection 
const serviceRequestCollectionRef = collection(formsDocRef, "SERVICE-REQUEST");

// Access ARCHIVES document under main collection
const archivesRef = doc(mainCollectionRef, "ARCHIVES");

const archivesCollectionRef = collection(archivesRef, "ARCHIVES-DOCUMENT");

const TABLE_HEAD = [
  { id: 'name', label: 'Faculty Name', alignRight: false },
  { id: 'company', label: 'Location/Room', alignRight: false },
  { id: 'role', label: 'Control No.', alignRight: false },
  { id: 'isVerified', label: 'Approved', alignRight: false },
  { id: 'status', label: 'Date', alignRight: false },
  { id: '' },
];

export default function UserPage() {

  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllDocuments = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(serviceRequestCollectionRef);
      const dataFromFirestore = [];

      querySnapshot.forEach((doc) => {
        // Handle each document here
        const data = doc.data();
        data.id = doc.id; // Add the ID field
        dataFromFirestore.push(data);
      });

      setFetchedData(dataFromFirestore);
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
   }, []);


  const [formData, setFormData] = useState({
   
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ControlNum, Date, FullName, LocationRoom, Requisitioner, Services } = formData;

    const docData = {
      ControlNum,
      Date,
      FullName,
      LocationRoom,
      Requisitioner,
      Services,
    };

      try {
        const docRef = await addDoc(serviceRequestCollectionRef, docData);

        const newDocumentId = docRef.id;

        // Create a new data object that includes the ID
        const newData = { ...docData, id: newDocumentId };
    
        // Update the state with the new data, adding it to the table
        setFetchedData([...fetchedData, newData]);

        setOpen(false);
        setSnackbarOpen(true);
      } catch (error) {
        console.error(error);
        alert("Input cannot be incomplete");
      }
  };

  //  This one is for Search bar
  const [searchQuery, setSearchQuery] = useState('');


  const handleFilterByName = (event) => {
    setPage(0);
    setSearchQuery(event.target.value);
  };

  const filteredData = fetchedData.filter((item) =>
['ControlNum', 'Date', 'FullName', 'LocationRoom', 'Requisitioner', 'Services'].some(
  (field) =>
    item[field].toLowerCase().includes(searchQuery.toLowerCase())
)
);
// This one is for the Edit button
const [editData, setEditData] = useState(null);


const [editOpen, setEditOpen] = useState(false);


const handleEditOpen = (data) => {
  if (data && data.id) {
    setEditData(data); 
    setEditOpen(true);
  }
};

const handleEditClose = () => {
  setEditData(null); 
  setEditOpen(false);
};

const handleEditSubmit = async () => {
  
  try {
    const docRef = doc(serviceRequestCollectionRef, editData.id); // Assuming you have an 'id' field in your data
    await updateDoc(docRef, editData);
    handleEditClose();
    setSnackbarOpen1(true);
  } catch (error) {
    console.error("Error updating data in Firestore: ", error);
  }
};

// This one is for the Delete button
const [documentToDelete, setDocumentToDelete] = useState(null);

const handleConfirmDeleteWithoutArchive = async () => {
  try {

    if (documentToDelete) {
      const sourceDocumentRef = doc(serviceRequestCollectionRef, documentToDelete);
      const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();
   
    await deleteDoc(doc(serviceRequestCollectionRef, documentToDelete));
    
    // Update the UI by removing the deleted row
    setFetchedData((prevData) => prevData.filter((item) => item.id !== documentToDelete));
    
    setSnackbarOpenDelete(true); // Show a success message

    // setDocumentToDelete(documentId);
    // setArchiveDialogOpen(true);
    }
  } catch (error) {
    console.error("Error deleting document:", error);
  } finally {
    // Close the confirmation dialog
    setArchiveDialogOpen(false);
    // Reset the documentToDelete state
    setDocumentToDelete(null);
  }
};

const handleDelete = (documentId) => {
  // Show a confirmation dialog before deleting
  setArchiveDialogOpen(true);
  setDocumentToDelete(documentId);
};



// This one is for Archives
  
const [snackbarOpenArchive, setSnackbarOpenArchive] = useState(false);

const handleConfirmDelete = async () => {
  try {
    if (documentToDelete) {
      const sourceDocumentRef = doc(serviceRequestCollectionRef, documentToDelete);
      const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();

      // Add the document to the "Archives" collection with a new unique ID
      await addDoc(archivesCollectionRef, sourceDocumentData);

      // Delete the original document
      await deleteDoc(doc(serviceRequestCollectionRef, documentToDelete));

      // Update the UI by removing the deleted row
      setFetchedData((prevData) => prevData.filter((item) => item.id !== documentToDelete));

      // Show a success message
      setSnackbarOpenArchive(true);
    }
  } catch (error) {
    console.error('Error archiving document:', error);
  } finally {
    // Close the confirmation dialog
    setArchiveDialogOpen(false);
    // Reset the documentToDelete state
    setDocumentToDelete(null);
  }
};

  // This one is for Archives and Delete together


const [page, setPage] = useState(0); // Add these state variables for pagination
const [rowsPerPage, setRowsPerPage] = useState(4);

const startIndex = page * rowsPerPage;
const endIndex = startIndex + rowsPerPage;
const displayedData = filteredData.slice(startIndex, endIndex);


const handlePageChange = (event, newPage) => {
  console.log("Page changed to:", newPage); // Log the new page number
  setPage(newPage);
};

const handleRowsPerPageChange = (event) => {
  const newRowsPerPage = parseInt(event.target.value, 10);
  console.log("Rows per page changed to:", newRowsPerPage); // Log the new rows per page value
  setRowsPerPage(newRowsPerPage);
  setPage(0); // Reset to the first page when changing rows per page
};

  const [snackbarOpenDelete, setSnackbarOpenDelete] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  
// This one is for idk lol
  const [open, setOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [snackbarOpen1, setSnackbarOpen1] = useState(false);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Helmet>
        <title> Service Request Form | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
            Service Request Form
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      { <div>

      <TextField
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleFilterByName}
      /> 

      </div> }


        <div style={{ marginLeft: '16px' }}>
          <Button onClick={handleClickOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </div>   
          
          <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Service Request Form</DialogTitle>
        <DialogContent>
           <form onSubmit={handleSubmit}>
      <TextField
        type="text"
        name="ControlNum"
        placeholder="Control Number"
        value={formData.ControlNum}
        onChange={(e) => setFormData({ ...formData, ControlNum: e.target.value })}
      /><br/>
      <TextField
        type="date"
        name="Date"
        placeholder="Date"
        value={formData.Date}
        onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
      /><br/>
      <TextField
        type="text"
        name="FullName"
        placeholder="Full Name"
        value={formData.FullName}
        onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
      /><br/>
      <TextField
        type="text"
        name="LocationRoom"
        placeholder="Location/Room"
        value={formData.LocationRoom}
        onChange={(e) => setFormData({ ...formData, LocationRoom: e.target.value })}
        /><br/>
        <TextField
        type="text"
        name="Requisitioner"
        placeholder="Requisitioner"
        value={formData.Requisitioner}
        onChange={(e) => setFormData({ ...formData, Requisitioner: e.target.value })}
        /><br/>
        <TextField
        type="text"
        name="Services"
        placeholder="Services"
        value={formData.Services}
        onChange={(e) => setFormData({ ...formData, Services: e.target.value })}
        />

        </form>
        </DialogContent>
        <DialogActions>
        <Button variant="contained" onClick={handleSubmit} type="submit" >
            Clear
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} type="submit" >
            Create
          </Button>
         

        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="The Service Request Document was created successfully!"
      />
          </div> 
    
        </Stack>       
      </Container>

    

<Container>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Control Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Location/Room</TableCell>
                <TableCell>Requesitioner</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Edit</TableCell> 
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {displayedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.ControlNum}</TableCell>
                  <TableCell>{item.Date}</TableCell>
                  <TableCell>{item.FullName}</TableCell>
                  <TableCell>{item.LocationRoom}</TableCell>
                  <TableCell>{item.Requisitioner}</TableCell>
                  <TableCell>{item.Services}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(item)}>
                      <Iconify icon="material-symbols:edit" color="orange" /> {/* Edit button icon */}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                      <IconButton onClick={() => handleDelete(item.id)}>
                         <Iconify icon="material-symbols:delete-forever-outline-rounded" color="red" /> {/* Delete button icon */}
                      </IconButton>
                  </TableCell>
              </TableRow>

              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          Do you want to delete or archive this document?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDeleteWithoutArchive} color="error">Delete</Button>
          <Button onClick={handleConfirmDelete} style={{ color: 'orange' }}>Archive</Button>
        </DialogActions>
      </Dialog>
       <TablePagination
        rowsPerPageOptions={[4, 10, 25]}
        component="div"
        count={filteredData.length} // Make sure this reflects the total number of rows
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* This is the dialog for the Edit button */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Service Request</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            {/* Fields to edit */}
            <TextField
              type="text"
              name="ControlNum"
              placeholder="Control Number"
              value={editData ? editData.ControlNum : ''}
              onChange={(e) => setEditData({ ...editData, ControlNum: e.target.value })}
            /><br/>
            <TextField
              type="date"
              name="Date"
              placeholder="Date"
              value={editData ? editData.Date : ''}
              onChange={(e) => setEditData({ ...editData, Date: e.target.value })}
            /><br/>
            <TextField
              type="text"
              name="FullName"
              placeholder="Full Name"
              value={editData ? editData.FullName: ''}
              onChange={(e) => setEditData({ ...editData, FullName: e.target.value })}
            /><br/>
            <TextField
              type="text"
              name="LocationRoom"
              placeholder="Location/Room"
              value={editData ? editData.LocationRoom : ''}
              onChange={(e) => setEditData({ ...editData, LocationRoom: e.target.value })}
              /><br/>
              <TextField
              type="text"
              name="Requisitioner"
              placeholder="Requisitioner"
              value={editData ? editData.Requisitioner : ''}
              onChange={(e) => setEditData({ ...editData, Requisitioner: e.target.value })}
              /><br/>
              <TextField
              type="text"
              name="Services"
              placeholder="Services"
              value={editData ? editData.Services : ''}
              onChange={(e) => setEditData({ ...editData, Services: e.target.value })}
              />

            {/* Add similar fields for other data */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleEditClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEditSubmit} type="submit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen1}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen1(false)}
        message="The Service Request Document was edited successfully!"
      />
      <Snackbar
        open={snackbarOpenDelete}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenDelete(false)}
        message="The Service Request Document was deleted successfully!"
      />

<Snackbar
        open={snackbarOpenArchive}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenArchive(false)}
        message="The Service Request Document was archived successfully!"
      />

      <Button
      onClick={fetchAllDocuments}
      variant="contained"
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent', // Set the background color to transparent
        border: 'none', // Remove the border
        }}
      >
      <Iconify icon="system-uicons:refresh-alt" color="blue" width={30} height={30} />
    </Button>
    </Container>

    </>
  );
}


