import { Box, Button } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import {useState} from "react"
import MDEditor from '@uiw/react-md-editor';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TypePgraphy from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import {updateCardDetail} from '../../../redux/CardActivity/cardActiveSlice'
import { toast } from 'react-toastify';
import {updateCardAction} from '../../../redux/activeBoard/activeBoardSlice'

const CardActivityEditor = ({ cardActive}) => {
  const  dispatch = useDispatch()
  const {mode} = useColorScheme();
  const [stateEditor, setStateEditor] = useState(true);
  const [value, setValue] = useState(cardActive?.description);
  

  const saveDes = async ()=>{
    const data ={
      description: value,
    }
    console.log(data)
    const result =  dispatch(updateCardDetail({CardId: cardActive._id, data})) .then(() => {
    toast.success('Updated description')
    setStateEditor(!stateEditor)
    dispatch(updateCardAction({...data , columnId: cardActive.columnId ,id:cardActive._id}))
  })
  }
  return (
    <Box
      sx={{
        mt: 1
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center',gap: 1, mb: 1, }}>
        <DescriptionOutlinedIcon />
        <TypePgraphy variant="subtitle1" component="h3" sx={{ fontWeight: 'bold' , fontSize: '1.25rem', color: 'text.primary' }}>
          Description
        </TypePgraphy>
        {stateEditor &&
        
          <Button onClick={() => setStateEditor(!stateEditor)} sx={{ ml: 'auto' , mt:0 ,bgcolor:'blue', color:'white', '&:hover': { bgcolor: 'darkblue' } ,display: 'inline-flex'}}>
            Edit
          </Button>
          }
      </Box>
      {!stateEditor ?
        <Box sx={{
          display: 'flex', flexDirection: 'column', gap: 1, mt:1
        }}
          >
          <Box data-color-mode={mode}>
            <MDEditor
              value={value}
              onChange={setValue}
              preview="edit"
              style={{ maxWidth: '100%' }}
              height={200}
            />
          <Button sx={{ mt: 1, ml: 'auto' ,display: 'flex', bgcolor:'green', color:'white', '&:hover': { bgcolor: 'darkgreen' } }} 
          onClick={saveDes}>
            Save
          </Button>
          </Box>
        
        </Box>
      
      :
        <Box
        data-color-mode={mode}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            height: 200,
            p: 1,
            overflow: 'auto',
            mt: 1,
          }}>
          <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />
          
        </Box>
      }

      
      
    </Box>
  )
}

export default CardActivityEditor