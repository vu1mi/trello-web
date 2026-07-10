import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


export function CreateBoardModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
 const [type, setType] = useState("private");

  const handleSubmit = () => {
    if (!title) return;

    onSubmit({
      title,
      description: desc,
      type
    });
    setTitle("");
    setDesc("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create new board</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Board title"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          fullWidth
          label="Description"
          margin="normal"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <RadioGroup row  name="row-radio-buttons-group" value={type} onChange={(e) => setType(e.target.value)}>
            <FormControlLabel value="private" control={<Radio />} label="Private" />
            <FormControlLabel value="public" control={<Radio />} label="Public" />
           
        </RadioGroup>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}