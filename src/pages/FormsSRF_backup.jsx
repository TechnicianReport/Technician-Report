import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFirestore, collection, query, onSnapshot, doc, getDocs, where, updateDoc, deleteDoc, addDoc, getDoc, documentId } from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';


// @mui
import {Card,Table,Stack,Paper,Avatar,Popover,Checkbox,TableRow,
        MenuItem,TableBody,TableCell,Container,Typography,IconButton,TableContainer,
        TablePagination,Dialog, DialogTitle, DialogContent, DialogActions, Button, 
        Backdrop, Snackbar, TableHead, CircularProgress, TextField} from '@mui/material';

// components
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

export default function UserPage() {

  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

//  Clear Form
  const initialFormData = {
    ControlNum: '',
    Date: '',
    FullName: '',
    LocationRoom: '',
    Requisitioner: '',
    Services: '',
    fileURL: '',
  };

  const clearForm = () => {
    setFormData(initialFormData);
  };
// Show Query 
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

  // for Adding new documents

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ControlNum, Date, FullName, LocationRoom, Requisitioner, Services, fileURL } = formData;

    const docData = {ControlNum,Date,FullName,LocationRoom,Requisitioner,Services,   
      fileURL: fileURL || '',};

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
    handleMenuClose();
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
  handleMenuClose();
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

  // This one is for Uploading files 

  const storage = getStorage(firebaseApp);

  const handleFileUpload = async (file) => {
  try {
    const allowedFileTypes = [
      'application/pdf', // PDF
      'image/png',       // PNG images
      'image/jpeg',      // JPEG images
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (XLSX)
      'application/msword', // MS Word (DOC)
      'application/vnd.ms-excel', // MS Excel (XLS)
      'text/plain',      // Plain text
      // Add more MIME types for other file formats as needed
    ];

    if (!allowedFileTypes.includes(file.type)) {
      console.error('Unsupported file type. Please upload a valid document.');
      return;
    }

    const storageRef = ref(storage, `documents/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Now you have the downloadURL, you can store it in Firestore or your form data
    // You can add it to the `formData` object or create a separate field for it
    setFormData((prevFormData) => ({
      ...prevFormData,
      fileURL: downloadURL, // Change this field name to match your data structure
    }));
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};
      
      const handleUploadSubmit = async (e) => {
    e.preventDefault();

    const { ControlNum, Date, FullName, LocationRoom, Requisitioner, Services, fileURL } = formData;

    // Ensure that the fileURL is set to a default value or handle it appropriately
    const docData = {
      ControlNum,
      Date,
      FullName,
      LocationRoom,
      Requisitioner,
      Services,
      fileURL: fileURL || '', // Set a default value or handle it based on your use case
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

  // This one is for Pagination


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
// This one is for menu button
const [menuAnchorEl, setMenuAnchorEl] = useState(null);
const [selectedItem, setSelectedItem] = useState(null);

const handleMenuOpen = (event, item) => {
  setMenuAnchorEl(event.currentTarget);
  setSelectedItem(item);
};

const handleMenuClose = () => {
  setMenuAnchorEl(null);
  setSelectedItem(null);
};

// This one is for checkboxes
const [selectAll, setSelectAll] = useState(false);
const [selectedItems, setSelectedItems] = useState([]);
const [bulkDeleteMode, setBulkDeleteMode] = useState(false);

const handleSelection = (documentId) => {
  setSelectedItems((prevSelectedItems) => {
    if (prevSelectedItems.includes(documentId)) {
      return prevSelectedItems.filter((id) => id !== documentId);
    }
    return [...prevSelectedItems, documentId];
  });
};

const handleSelectAll = () => {
  if (bulkDeleteMode) {
    // If bulk delete mode is already active, clear the selected items
    setSelectedItems([]);
  } else {
    // If bulk delete mode is not active, select all items
    const allDocumentIds = fetchedData.map((item) => item.id);
    setSelectedItems(allDocumentIds);
  }
  setBulkDeleteMode(!bulkDeleteMode);
  setSelectAll(!selectAll); // Toggle the selectAll state
};



// Checkbox bulk deletion

const handleTrashIconClick = () => {
  // Check if any items are selected
  if (selectedItems.length === 0) {
    // If no items are selected, show an error message or handle it as you prefer
    console.error("No items selected for deletion.");
    return;
  }

  // Open a confirmation dialog before deleting
  // You can use a state variable to manage the dialog's open state
  setDeleteConfirmationDialogOpen(true);
};

// Add a state variable for managing the confirmation dialog
// Function to handle the confirmation and actually delete the items
const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);

// Function to handle the confirmation and actually delete the items
const handleConfirmDeleteAll = async () => {
  try {
    // Create an array of promises to delete each selected item
    const deletePromises = selectedItems.map(async (itemId) => {
      return deleteDoc(doc(serviceRequestCollectionRef, itemId));
    });

    // Use Promise.all to await all the delete operations
    await Promise.all(deletePromises);

    // Update the UI by removing the deleted rows
    setFetchedData((prevData) => {
      return prevData.filter((item) => !selectedItems.includes(item.id));
    });

    // Clear the selected items
    setSelectedItems([]);
    setBulkDeleteMode(false);

    // Close the confirmation dialog
    setDeleteConfirmationDialogOpen(false);

    // Show a success message
    setSnackbarOpenDelete(true);
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
};

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

    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={5}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <TextField
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleFilterByName}
            sx={{ width: '%' }}
          />
        </div>

        <div>
          <Button
            onClick={fetchAllDocuments}
            variant="contained"
            style={{
              margin: '0 8px', // Add margin for spacing
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'transparent', // Set the background color to transparent
              boxShadow: 'none', // Remove the box shadow
            }}
          >
            <Iconify icon="zondicons:refresh" color="#2065D1" width={55} height={55} />
          </Button>
        </div>
      </div>

      <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
        {selectedItems.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleTrashIconClick} >
              <Iconify icon="material-symbols:delete-forever-outline-rounded" color="red" width={42} height={42} />
            </IconButton>
            <Typography variant="subtitle1" style={{ paddingRight: '16px' }}>
              {selectedItems.length} items selected
            </Typography>
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <Button onClick={handleClickOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </div>
        
          <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Service Request Form</DialogTitle>
        <DialogContent>
           <form onSubmit={handleSubmit}>
      <TextField
        type="date"
        name="Date"
        placeholder="Date"
        value={formData.Date}
        onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
        sx={{ width: '70%' }}
      />
      <TextField
        type="text"
        name="ControlNum"
        placeholder="Control Number"
        value={formData.ControlNum}
        onChange={(e) => setFormData({ ...formData, ControlNum: e.target.value })}
        sx={{ width: '70%' }}
      /><br/>
      <TextField
        type="text"
        name="FullName"
        placeholder="Faculty Name"
        value={formData.FullName}
        onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
        sx={{ width: '70%' }}
      /><br/>
      <TextField
        type="text"
        name="LocationRoom"
        placeholder="Location/Room"
        value={formData.LocationRoom}
        onChange={(e) => setFormData({ ...formData, LocationRoom: e.target.value })}
        sx={{ width: '70%' }}
        /><br/>
      <TextField
        type="text"
        name="Services"
        placeholder="Services"
        value={formData.Services}
        onChange={(e) => setFormData({ ...formData, Services: e.target.value })}
        sx={{ width: '70%' }}
        /><br/>
      <TextField
        type="text"
        name="Requisitioner"
        placeholder="Requisitioner"
        value={formData.Requisitioner}
        onChange={(e) => setFormData({ ...formData, Requisitioner: e.target.value })}
        sx={{ width: '70%' }}
        />

        </form>
        </DialogContent>
        <DialogActions>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
        <Button variant="contained" onClick={clearForm} >
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
                <TableCell>
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  color="primary"
                />
                </TableCell>
                <TableCell>Control Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Location/Room</TableCell>
                <TableCell>Requesitioner</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Menu</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {displayedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell> 
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelection(item.id)}
                      />
                  </TableCell>
                  <TableCell>{item.ControlNum}</TableCell>
                  <TableCell>{item.Date}</TableCell>
                  <TableCell>{item.FullName}</TableCell>
                  <TableCell>{item.LocationRoom}</TableCell>
                  <TableCell>{item.Requisitioner}</TableCell>
                  <TableCell>{item.Services}</TableCell>
                  <TableCell>
                    {item.fileURL ? (
                      // Render a clickable link to download the file
                      <Link to={item.fileURL} target="_blank" download>
                        Download 
                      </Link>
                    ) : (
                      // Display "No File" if there's no file URL
                      "No File"
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="menu"
                      onClick={(event) => handleMenuOpen(event, item)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
              </TableRow>

              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
        <DialogTitle>Remove Document</DialogTitle>
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
    <Popover
      open={Boolean(menuAnchorEl)}
      anchorEl={menuAnchorEl}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={() => handleEditOpen(selectedItem)}>Edit</MenuItem>
      <MenuItem onClick={() => handleDelete(selectedItem.id)}>Remove</MenuItem>
    </Popover>

    <Dialog
      open={deleteConfirmationDialogOpen}
      onClose={() => setDeleteConfirmationDialogOpen(false)}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete {selectedItems.length} items?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteConfirmationDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirmDeleteAll} color="error">Delete</Button>
      </DialogActions>
    </Dialog>

        </Container>

    </>
  );}


