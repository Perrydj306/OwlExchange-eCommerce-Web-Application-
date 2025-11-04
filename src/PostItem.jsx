import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Tabs,
  Tab
} from '@mui/material';
import {
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  SwapHoriz as SwapIcon,
  CardGiftcard as GiftIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import './PostItem.css';

const PostItem = ({ open, onClose }) => {
  const [transactionType, setTransactionType] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    tags: '',
    contactMethod: 'KSU Email Only',
    imageUrl: ''
  });

  const handleTabChange = (event, newValue) => {
    setTransactionType(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image uploads
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/items/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        alert("Photo uploaded successfully!");
      } else {
        alert("Upload failed. Try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image");
    }
  };

  // Submit new item with userId automatically
  const handleSubmit = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("You must be logged in to post an item.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        transactionType,
        userId: user.id, // attach the logged-in user's ID
      }),
    });

    if (response.ok) {
      alert("Item posted successfully!");
      onClose();
    } else {
      alert("Failed to post item.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server connection failed.");
  }
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth className="post-item-dialog">
      <DialogTitle className="dialog-title">
        <Typography variant="h5" className="modal-title">
          Post an Item
        </Typography>
        <IconButton onClick={onClose} className="close-button">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="dialog-content">
        {/* Transaction Type Tabs */}
        <Tabs
          value={transactionType}
          onChange={handleTabChange}
          className="transaction-tabs"
        >
          <Tab icon={<MoneyIcon />} label="Sell Item" className="tab-button" />
          <Tab icon={<SwapIcon />} label="Trade/Exchange" className="tab-button" />
          <Tab icon={<GiftIcon />} label="Donate (Free)" className="tab-button" />
        </Tabs>

        {/* Form Fields */}
        <Box className="form-container">
          {/* Title */}
          <Box className="form-field">
            <Typography variant="body2" className="field-label">
              Title <span className="required">*</span>
            </Typography>
            <TextField
              fullWidth
              name="title"
              placeholder="e.g., Calculus Textbook - 8th Edition"
              value={formData.title}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Description */}
          <Box className="form-field">
            <Typography variant="body2" className="field-label">
              Description <span className="required">*</span>
            </Typography>
            <TextField
              fullWidth
              name="description"
              placeholder="Describe the item's condition, any defects, why you're selling, etc."
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              variant="outlined"
            />
          </Box>

          {/* Category and Condition */}
          <Box className="form-row">
            <Box className="form-field" style={{ flex: 1 }}>
              <Typography variant="body2" className="field-label">
                Category <span className="required">*</span>
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select category
                  </MenuItem>
                  <MenuItem value="textbooks">Textbooks</MenuItem>
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="furniture">Dorm Essentials</MenuItem>
                  <MenuItem value="school supplies">School Supplies</MenuItem>
                  <MenuItem value="clothing">Clothing</MenuItem>
                  <MenuItem value="household">Household</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box className="form-field" style={{ flex: 1 }}>
              <Typography variant="body2" className="field-label">
                Condition <span className="required">*</span>
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select condition
                  </MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="like-new">Like New</MenuItem>
                  <MenuItem value="good">Good</MenuItem>
                  <MenuItem value="fair">Fair</MenuItem>
                  <MenuItem value="poor">Poor</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Price (only show for Sell Item) */}
          {transactionType === 0 && (
            <Box className="form-field">
              <Typography variant="body2" className="field-label">
                Price <span className="required">*</span> (USD)
              </Typography>
              <TextField
                fullWidth
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
                type="number"
              />
            </Box>
          )}

          {/* Photos */}
          <Box className="form-field">
            <Typography variant="body2" className="field-label">
              Photos
            </Typography>
            <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
              Upload Photo
              <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
            </Button>

            {/* Image Preview */}
            {formData.imageUrl && (
              <Box mt={2} textAlign="center">
                <img
                  src={formData.imageUrl}
                  alt="Uploaded preview"
                  style={{
                    width: '150px',
                    borderRadius: '8px',
                    marginTop: '10px',
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Tags */}
          <Box className="form-field">
            <Typography variant="body2" className="field-label">
              Tags (optional)
            </Typography>
            <TextField
              fullWidth
              name="tags"
              placeholder="Add tags (e.g., urgent, negotiable)"
              value={formData.tags}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
          </Box>

          {/* Preferred Contact Method */}
          <Box className="form-field">
            <Typography variant="body2" className="field-label">
              Preferred Contact Method
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleInputChange}
              >
                <MenuItem value="KSU Email Only">KSU Email Only</MenuItem>
                <MenuItem value="Phone">Phone</MenuItem>
                <MenuItem value="Text">Text</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Action Buttons */}
          <Box className="action-buttons">
            <Button variant="outlined" onClick={onClose} className="cancel-button">
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} className="post-button">
              Post Item
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PostItem;
