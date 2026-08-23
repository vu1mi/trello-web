import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import theme from "~/theme";

export default function EditableTitle({ initialValue , onChange }) {
  const [value, setValue] = useState(initialValue || "Click để sửa");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue || "Click để sửa");
  }, [initialValue]);

  const triggerBlur = (e) => {
    if(!value){
      return setValue(initialValue);
    }
    if(value === initialValue){
      return 
    }

    onChange(value);
  }

  return (
    <TextField
      variant="standard"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onFocus={() => setIsEditing(true)}
      onBlur={triggerBlur}
      fullWidth
      InputProps={{
        disableUnderline: true,
      }}
      sx={{
        '& label': {},

          '& input': {
            // fontSize: inputFontSize,
            fontWeight: 'bold',
          },

          '& .MuiOutlinedInput-root': {
            backgroundColor: 'transparent',

            // 🔥 border mặc định
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },

            // 🔥 hover
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },

            // 🔥 focus (QUAN TRỌNG NHẤT)
            '&.Mui-focused': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#333' : '#fff',

              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.primary.main,
              },
            },
          },
      }}
      onClick={() => {
        if (!isEditing) setIsEditing(true);
      }}
    />
  );
}