import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFirestore, collection, query, onSnapshot, doc, getDocs, where, updateDoc, deleteDoc, addDoc, getDoc, documentId, setDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// @mui
import {Card,Table,Stack,Paper,Avatar,Popover,Checkbox,TableRow,
        MenuItem,TableBody,TableCell,Container,Typography,IconButton,TableContainer,
        TablePagination,Dialog, DialogTitle, DialogContent, DialogActions, Button, 
        Backdrop, Snackbar, TableHead, CircularProgress, TextField, Select} from '@mui/material';

// components
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
// ----------------------------------------------------------------------

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
const BorrowersCollectionRef = collection(formsDocRef, "ITEM-BORROWERS");

// Access ARCHIVES document under main collection
const archivesRef = doc(mainCollectionRef, "ARCHIVES");

const archivesCollectionRef = collection(archivesRef, "ARCHIVES-FORMS");

// Second declaration
const storage = getStorage(firebaseApp);

// ----------------------------------------------------------------------

export default function UserPage() {
  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

  const initialFormData = {
    ControlNum: '',
    Date: '',
    FullName: '',
    LocationRoom: '',
    Borrower: '',
    Items: '',
    fileInput: '',
    fileURL: '',
  };

  // For Clearing the Form
  const clearForm = () => {
    setFormData(initialFormData);
  };

  // Handle change function
  const [formData, setFormData] = useState({
    ControlNum: '', // Add default values here
    Date: '',       // Add default values here
    FullName: '',   // Add default values here
    LocationRoom: '', // Add default values here
    Borrower: '', // Add default values here
    Items: '',  // Add default values here
    fileURL: '',    // Add default values here
  });

  // Show Query or the table, fetch data from firestore

  const fetchAllDocuments = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(BorrowersCollectionRef);
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

  const currentDocumentName = "SRF-00"; // Initialize it with your default document name

  // Function to increment the document name

  const incrementDocumentName = async (nextNumber = 0) => {
    const newDocumentName = `SRF-${nextNumber.toString().padStart(2, "0")}`;

    // Check if the document with the new name already exists
    const docSnapshot = await getDoc(doc(BorrowersCollectionRef, newDocumentName));

    if (docSnapshot.exists()) {
      // The document with the new name exists, so increment and try again
      return incrementDocumentName(nextNumber + 1);
    }

    // The document with the new name doesn't exist, so we can use it
    return newDocumentName; // Return the generated document name
  };

  // function for Adding new documents
 const handleSubmit = async (e) => {
  e.preventDefault();

  const { ControlNum, Date, FullName, LocationRoom, Borrower, Items=[], fileURL } = formData;

  try {
    // Use the current document name when adding a new document
    const documentName = await incrementDocumentName();

    const docRef = doc(BorrowersCollectionRef, documentName);

    const docData = {
      ControlNum,
      Date,
      FullName,
      LocationRoom,
      Borrower,
      Items,
      fileURL: fileURL || '',
      archived: false, // Include the 'archived' field and set it to false for new documents
      originalLocation: "BORROWERS", // Include the 'originalLocation' field
    };

    await setDoc(docRef, docData);

    // Create a new data object that includes the custom ID
    const newData = { ...docData, id: documentName };

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

  const filteredData = fetchedData.filter((item) => {
    const fieldsToSearchIn = ['ControlNum', 'Date', 'FullName', 'LocationRoom', 'Borrower'];
  
    const servicesMatch = (item, searchQuery) => {
      return item.Services && Array.isArray(item.Services) &&
        item.Services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
    };
  
    return fieldsToSearchIn.some(field => {
      if (item[field] && typeof item[field] === 'string') {
        return item[field].toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (field === 'Items' && Array.isArray(item[field])) {
        return servicesMatch(item, searchQuery);
      }
      return false;
    });
  });

  // This one is for the Edit button
const [editData, setEditData] = useState(null);
const [editOpen, setEditOpen] = useState(false);

const handleEditOpen = (data) => {
  if (data && data.id) {
    // Populate the form fields with existing data
    setFormData({
      ...formData,
      ControlNum: data.ControlNum || '',
      Date: data.Date || '',
      FullName: data.FullName || '',
      LocationRoom: data.LocationRoom || '',
      Borrower: data.Borrower || '',
      Items: data.Items || '',
      fileURL: data.fileURL || '',
      id: data.id, // Set the document ID here
    });
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
    const docRef = doc(BorrowersCollectionRef, formData.id); // Use the document ID for updating

    // Update the editData object with the new file URL
    editData.fileURL = formData.fileURL;

    await updateDoc(docRef, editData); // Use editData to update the document
    handleEditClose();
    setSnackbarOpen1(true);
  } catch (error) {
    console.error("Error updating data in Firestore: ", error);
  }
};

// This one is still for Edit button but for the file upload part


const handleFileEditUpload = async (file) => {
  const docRef = doc(BorrowersCollectionRef, formData.id); // Use the document ID for updating
  try {
    if (file) {
      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update the Firestore document here using 'updateDoc' or another method
      await updateDoc(docRef, { fileURL: downloadURL });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

// This one is for the Delete button
const [documentToDelete, setDocumentToDelete] = useState(null);

const handleConfirmDeleteWithoutArchive = async () => {
  try {

    if (documentToDelete) {
      const sourceDocumentRef = doc(BorrowersCollectionRef, documentToDelete);
      const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();
   
    await deleteDoc(doc(BorrowersCollectionRef, documentToDelete));

    // Update the UI by removing the deleted row
    setFetchedData((prevData) => prevData.filter((item) => item.id !== documentToDelete));
    
    setSnackbarOpenDelete(true); // Show a success message

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
      const sourceDocumentRef = doc(BorrowersCollectionRef, documentToDelete);
      // Set the 'originalLocation' field to the current collection and update the Archive as true
      await updateDoc(sourceDocumentRef, { archived: true, originalLocation: "BORROWERS" });
      const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();


      // Fetch existing document names from the Archives collection
      const archivesQuerySnapshot = await getDocs(archivesCollectionRef);
      const existingDocumentNames = archivesQuerySnapshot.docs.map((doc) => doc.id);

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
      const newDocumentName = `SRF-${nextNumber.toString().padStart(2, "0")}`;

      // Add the document to the "Archives" collection with the new document name
      await setDoc(doc(archivesCollectionRef, newDocumentName), sourceDocumentData);

      // Delete the original document from the Service Request collection
      await deleteDoc(doc(BorrowersCollectionRef, documentToDelete));

      // Update the UI by removing the archived document
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

    const { ControlNum, Date, FullName, LocationRoom, Borrower, Items, fileURL } = formData;

    // Ensure that the fileURL is set to a default value or handle it appropriately
    const docData = {
      ControlNum,
      Date,
      FullName,
      LocationRoom,
      Borrower,
      Items,
      fileURL: fileURL || '', // Set a default value or handle it based on your use case
    };

    try {
      const docRef = await addDoc(BorrowersCollectionRef, docData);

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
      return deleteDoc(doc(BorrowersCollectionRef, itemId));
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
const [isOtherChecked, setIsOtherChecked] = useState(false);

const handleItemsChange = (e) => {
  const value = e.target.value;
  console.log('Checkbox clicked:', value);
  const isChecked = e.target.checked;
  let updatedItems;

  if (isChecked) {
    if (value === 'Others') {
      updatedItems = [...formData.Items, formData.otherItems];
    } else {
      updatedItems = [...formData.Items, value];
    }
    console.log('Checkbox is checked', updatedItems);
  } else {
    updatedItems = formData.Items.filter((Item) => Item !== value);
    console.log('Checkbox filtered', updatedItems);
  }
  setFormData({ ...formData, Items: updatedItems });
};

const handleOtherItemsChange = (e) => {
  const value = e.target.value;
  setFormData({ ...formData, otherItems: value });
};

  return (
    <>
      <Helmet>
        <title> Borrower's Form | Minimal UI </title>
      </Helmet>

      <Container>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
        Borrower's Form
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
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ mb: 5 }} style={{ alignSelf: 'center', color: '#ff5500', margin: 'auto', fontSize: '40px', fontWeight: 'bold', marginTop:'10px' }}>
                BORROWERS
              </Typography>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    type="date"
                    name="Date"
                    placeholder="Date"
                    value={formData.Date || ''}
                    onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                  <br />
                  <TextField
                    type="text"
                    name="ControlNum"
                    placeholder="Control Number"
                    value={formData.ControlNum || ''}
                    onChange={(e) => setFormData({ ...formData, ControlNum: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                  <br />
                  <TextField
                    type="text"
                    name="FullName"
                    placeholder="Faculty Name"
                    value={formData.FullName || ''}
                    onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                  <br />
                  <TextField
                    type="text"
                    name="LocationRoom"
                    placeholder="Location/Room"
                    value={formData.LocationRoom || ''}
                    onChange={(e) => setFormData({ ...formData, LocationRoom: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                  <br />
                  {/* Services fieldset goes here */}
                  <TextField
                    type="text"
                    name="Borrower"
                    placeholder="Borrower"
                    value={formData.Borrower || ''}
                    onChange={(e) => setFormData({ ...formData, Borrower: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                  <br />
                  
                  <fieldset>
                    <legend name="Items" >ITEMS:</legend>
                    <Checkbox
                      value=" HDMI,"
                      checked={formData.Items.includes(' HDMI,')}
                      onChange={handleItemsChange}
                    />
                    HDMI
                    <br />
                    <Checkbox
                      value=" Projector,"
                      checked={formData.Items.includes(' Projector,')}
                      onChange={handleItemsChange}
                    />
                    Projector
                    <br />
                    <Checkbox
                      value=" TV,"
                      checked={formData.Items.includes(' TV,')}
                      onChange={handleItemsChange}
                    />
                    TV
                    <br />
                    <Checkbox
                      value={formData.otherItems || ' Others,'}
                      checked={formData.Items.includes(' Others,')}
                      onChange={handleItemsChange}
                    />
                    Others:
                    <input
                      type="text"
                      value={formData.otherItems}
                      onChange={handleOtherItemsChange}
                      disabled={!formData.Items.includes(' Others,')}
                    />
                  </fieldset>         
                  <br/>
                  <TextField
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    sx={{ width: '100%' }}
                  />
                </form>
              </DialogContent>
              <DialogActions>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 'auto' }}>
                  <Button variant="contained" onClick={clearForm} sx={{marginRight: '5px', marginLeft: '5px'}}>
                    Clear
                  </Button>
                  <Button variant="contained" onClick={handleClose} sx={{marginRight: '5px', marginLeft: '5px'}}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSubmit} type="submit" sx={{marginRight: '5px', marginLeft: '5px'}}>
                    Create
                  </Button>
                </div>
              </DialogActions>
            </div>
          </div>
        </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="The Borrower's Document was created successfully!"
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
                <TableCell>Borrower</TableCell>
                <TableCell>Items</TableCell>
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
                  <TableCell>{item.Borrower}</TableCell>
                  <TableCell>{item.Items}</TableCell>
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

      <Dialog open={editOpen} onClose={handleEditClose}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ mb: 5 }} style={{ alignSelf: 'center', color: '#ff5500', margin: 'auto', fontSize: '40px', fontWeight: 'bold', marginTop:'10px' }}>
                BORROWERS
              </Typography>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            {/* Fields to edit */}
                  <TextField
                    type="date"
                    name="Date"
                    placeholder="Date"
                    value={editData ? editData.Date : ''}
                    onChange={(e) => setEditData({ ...editData, Date: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                  <br />
                  <TextField
                    type="text"
                    name="ControlNum"
                    placeholder="Control Number"
                    value={editData ? editData.ControlNum : ''}
                    onChange={(e) => setEditData({ ...editData, ControlNum: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                  <br />
                  <TextField
                    type="text"
                    name="FullName"
                    placeholder="Faculty Name"
                    value={editData ? editData.FullName : ''}
                    onChange={(e) => setEditData({ ...editData, FullName: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                  <br />
                  <TextField
                    type="text"
                    name="LocationRoom"
                    placeholder="Location/Room"
                    value={editData ? editData.LocationRoom : ''}
                    onChange={(e) => setEditData({ ...editData, LocationRoom: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                  <br />
                  <TextField
                    type="text"
                    name="Borrower"
                    placeholder="Borrower"
                    value={editData ? editData.Borrower : ''}
                    onChange={(e) => setEditData({ ...editData, Borrower: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                  <br />

                  <fieldset>
                    <legend name="Items" >Items:</legend>
                    <Checkbox
                      value=" HDMI,"
                      checked={formData.Items.includes(' HDMI,')}
                      onChange={handleItemsChange}
                    />
                    HDMI
                    <br />
                    <Checkbox
                      value=" Projector,"
                      checked={formData.Items.includes(' Projector,')}
                      onChange={handleItemsChange}
                    />
                    Projector
                    <br />
                    <Checkbox
                      value=" TV,"
                      checked={formData.Items.includes(' TV,')}
                      onChange={handleItemsChange}
                    />
                    TV
                    <br />
                    <Checkbox
                      value={formData.otherItems || ' Others,'}
                      checked={formData.Items.includes(' Others,')}
                      onChange={handleItemsChange}
                    />
                    Others:
                    <input
                      type="text"
                      value={formData.otherItems}
                      onChange={handleOtherItemsChange}
                      disabled={!formData.Items.includes(' Others,')}
                    />
                  </fieldset>
                  <br/>
                  <TextField
                    type="file"
                    name="fileInput"
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                    onChange={(e) => handleFileEditUpload(e.target.files[0])}
                    inputProps={{ className: "w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke dark:file:border-strokedark file:bg-[#EEEEEE] dark:file:bg-white/30 dark:file:text-white file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input" }}
                  />

          </form>
        </DialogContent>
        <DialogActions>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 'auto' }}>
            <Button variant="contained" onClick={handleEditClose} sx={{marginRight: '5px', marginLeft: '5px'}}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleEditSubmit} type="submit" sx={{marginRight: '5px', marginLeft: '5px'}}>
              Save
            </Button>
          </div>
        </DialogActions>
        </div>
      </div>
      </Dialog>

      <Snackbar
        open={snackbarOpen1}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen1(false)}
        message="The Borrower's Document was edited successfully!"
      />
      <Snackbar
        open={snackbarOpenDelete}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenDelete(false)}
        message="The Borrower's Document was deleted successfully!"
      />

      <Snackbar
        open={snackbarOpenArchive}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenArchive(false)}
        message="The Borrower's Document was archived successfully!"
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


