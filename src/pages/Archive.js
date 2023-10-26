import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFirestore, collection, query, onSnapshot, doc, getDocs, where, updateDoc, deleteDoc, addDoc, getDoc, setDoc, documentId } from '@firebase/firestore';
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

const archivesCollectionRef = collection(archivesRef, "ARCHIVES-FORMS");

export default function UserPage() {
  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

// Show Query or the table, fetch data from firestore

  const fetchAllDocuments = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(archivesCollectionRef);
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


  //  This one is for Search bar
  const [searchQuery, setSearchQuery] = useState('');


  const handleFilterByName = (event) => {
    setPage(0);
    setSearchQuery(event.target.value);
  };

  const filteredData = fetchedData.filter((item) =>
  ['ControlNum', 'Date', 'FullName', 'LocationRoom', 'Requisitioner', 'Services'].some(
    (field) =>
      (item[field] && item[field].toLowerCase().includes(searchQuery.toLowerCase()))
  )
);

// This one is for the Delete button
const [documentToDelete, setDocumentToDelete] = useState(null);

const handleConfirmDeleteWithoutArchive = async () => {
  try {

    if (documentToDelete) {
      const sourceDocumentRef = doc(archivesCollectionRef, documentToDelete);
      const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();
   
    await deleteDoc(doc(archivesCollectionRef, documentToDelete));
    
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

// Function to increment the document name
const incrementDocumentName = async (originalLocation) => {
  try {
    if (!originalLocation) {
      throw new Error('Original location is empty or undefined.');
    }

    // Fetch existing document names from the "SERVICE-REQUEST" collection
    const querySnapshot = await getDocs(collection(formsDocRef, originalLocation));
    const existingDocumentNames = querySnapshot.docs.map((doc) => doc.id);

    // Find the highest number and increment it by 1
    let nextNumber = 0;
    existingDocumentNames.forEach((docName) => {
      const match = docName.match(/^SRF-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!Number.isNaN(num) && num >= nextNumber) {
          nextNumber = num + 1;
        }
      }
    });

    // Generate the new document name
    const newDocumentName = `SRF-${nextNumber.toString().padStart(2, '0')}`;

    return newDocumentName;
  } catch (error) {
    console.error('Error incrementing document name:', error);
    return null; // Handle the error gracefully in your code
  }
};

// For restoring Archives

const [snackbarOpenRestore, setSnackbarOpenRestore] = useState(false); // Add this line for the restore snackbar

const handleRestoreDocument = async (documentId, originalLocation) => {
  try {
    // Retrieve the archived document from the "ARCHIVES-FORMS" collection
    const archivedDocumentRef = doc(archivesCollectionRef, documentId);
    const archivedDocumentData = (await getDoc(archivedDocumentRef)).data();

    // Set the "archived" field to false and "originalLocation" field
    archivedDocumentData.archived = false;
    archivedDocumentData.originalLocation = originalLocation;

    // Generate a new document name using the incrementDocumentName function
    const newDocumentName = await incrementDocumentName(originalLocation);

    // Add the archived document back to its original location with the new name
    const originalCollectionRef = collection(formsDocRef, originalLocation);
    await setDoc(doc(originalCollectionRef, newDocumentName), archivedDocumentData);

    // Delete the document from the "ARCHIVES-FORMS" collection
    await deleteDoc(archivedDocumentRef);

    // Update the UI by removing the restored document
    setFetchedData((prevData) => prevData.filter((item) => item.id !== documentId));

    // Show a success message
    setSnackbarOpenRestore(true);
  } catch (error) {
    console.error('Error restoring document:', error);
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

const handleMenuOpen = (event, selectedItem) => {
  setMenuAnchorEl(event.currentTarget);
  setSelectedItem(selectedItem); // Set the selected item here
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
      return deleteDoc(doc(archivesCollectionRef, itemId));
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

  // For restore dialog
  const [restoreConfirmationOpen, setRestoreConfirmationOpen] = useState(false);

  // Function to open the restore confirmation dialog
  const openRestoreConfirmation = () => {
    setRestoreConfirmationOpen(true);
    handleMenuClose();
  };

  // Function to close the restore confirmation dialog
  const closeRestoreConfirmation = () => {
    setRestoreConfirmationOpen(false);
  };
  return (
    <>
      <Helmet>
        <title> Archives Collection | Minimal UI </title>
      </Helmet>

      <Container>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
        Archives Collection
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
          Do you want to delete this document?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDeleteWithoutArchive} color="error">Delete</Button>
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

      <Snackbar
        open={snackbarOpenDelete}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenDelete(false)}
        message="The Service Request Document was deleted successfully!"
      />


    {selectedItem && (
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
        <MenuItem onClick={() => handleDelete(selectedItem.id)}>Remove</MenuItem>
        <MenuItem onClick={openRestoreConfirmation}>Restore</MenuItem>
      </Popover>
    )}



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

    <Dialog
        open={restoreConfirmationOpen}
        onClose={closeRestoreConfirmation}
        aria-labelledby="restore-confirmation-dialog"
      >
        <DialogTitle>Confirm Restore</DialogTitle>
        <DialogContent>
          Are you sure you want to restore this document?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRestoreConfirmation}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedItem && selectedItem.id && selectedItem.originalLocation) {
                handleRestoreDocument(selectedItem.id, selectedItem.originalLocation);
                closeRestoreConfirmation(); // Close the confirmation dialog
              }
              
            }}
            style={{ color: 'white', backgroundColor: 'green' }} // Apply the green color style here
          >
            Restore
          </Button>
        </DialogActions>
      </Dialog>

        </Container>

    </>
  );}


