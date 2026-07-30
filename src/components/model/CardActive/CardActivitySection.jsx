import { Typography, Box } from '@mui/material'
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EventIcon from '@mui/icons-material/Event';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { validateImage } from "~/utils/validation";
import {updateCardDetail,selectCardActive} from '../../../redux/CardActivity/cardActiveSlice'
import { toast } from 'react-toastify';
import { useDispatch , useSelector } from 'react-redux';
import {updateCardAction} from '../../../redux/activeBoard/activeBoardSlice'

const CardActivitySection = ({ cardActive}) => {
 const dataCard = useSelector(selectCardActive)
  const [coverdata , setCoverdata] = useState()
  const dispatch = useDispatch()
  const setcover =(e)=>{
    const file = e.target.files[0];
    const validationResult = validateImage(file);
    if (!validationResult.isValid) {
      toast.error(validationResult.message);
      return;
    }
    const formData = new FormData();
    formData.append('cover', file);
    console.log('file', formData.get('cover'));

      toast.promise(dispatch(updateCardDetail({CardId:cardActive._id, data:formData})).unwrap(), {
      pending: 'Updating card cover...',
      success: 'Card cover updated successfully!',
    }).then((datacardrespone) => {
       console.log('datacardrespone', datacardrespone.data.cover)
      e.target.value = ''; // Reset the file inputf
      const datacardcover  = {
        cover:datacardrespone?.data?.cover
      }
       dispatch(updateCardAction({...datacardcover, columnId: cardActive.columnId ,id:cardActive._id}))
    }).catch((err) => {
      console.error('Update profile error:', err);
    });
  }

  return (
    <Box sx={{ mb: 1 , display: 'flex', flexDirection: 'column', gap: 2 }}>

      <Box sx={{ display: 'flex', mb: 1,flexDirection: 'column',gap:2}}>
        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'text.title' }}>
          Add To Card
        </Typography>
        <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <PermIdentityIcon />
            Join
        </Button >
         <Button variant="text" component="label" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <PhotoCameraBackIcon />
            Cover
            <input hidden type="file" onChange={setcover} />
        </Button >
        <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <LocalOfferOutlinedIcon />
            Label
        </Button >
        <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <CheckCircleOutlineOutlinedIcon />
            Checklist
        </Button >
        <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <EventIcon />
            Dates
        </Button >
        <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <AutoFixHighOutlinedIcon />
            Custom Fields
        </Button >
      </Box>

      <Box sx={{height: '1px', bgcolor: 'divider' , width: '100%' }} />

      <Box sx={{ display: 'flex', mb: 1,flexDirection: 'column',gap:2}}>
        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'text.title' }}>
          Power-Ups
        </Typography>
       <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <AspectRatioIcon />
            Card Size
        </Button>
        <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <AddToDriveIcon />
            Add to Drive
        </Button>
       <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <AddIcon />
            Add Power-Ups
        </Button>
      </Box>
            
      <Box sx={{height: '1px', bgcolor: 'divider' , width: '100%' }} />
        <Box sx={{ display: 'flex', mb: 1,flexDirection: 'column',gap:2}}>
        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'text.title' }}>
          Power-Ups
        </Typography>
       <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <AspectRatioIcon />
            Card Size
        </Button>
        <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <AddToDriveIcon />
            Add to Drive
        </Button>
       <Button variant="text" sx={{  display: 'flex', gap: 1, fontWeight:'bold',color:'#000', justifyContent:'flex-start' ,alignItems:'center'}}>
          <AddIcon />
            Add Power-Ups
        </Button>
      </Box>
   
    </Box>
  )
}

export default CardActivitySection