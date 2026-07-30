import React, { useState } from 'react'
import { Box, Typography, Avatar } from '@mui/material'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import TextField from '@mui/material/TextField';
import { useSelector, useDispatch } from 'react-redux';
import {selectAllcomment} from '~/redux/CommentCard/commentCardSlice'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  ROLE_MESSAGES,
} from '../../../utils/validation';
import {creatNewComment} from '~/redux/CommentCard/commentCardSlice'

const UserGroupComment = ({ userdata , cardActive}) => {
    const dispatch = useDispatch()
    const commentData = useSelector(selectAllcomment)
    console.log('allcomment', cardActive._id)
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();
  const handerComment =(data) =>{
  
    
     toast
          .promise(dispatch(creatNewComment({ CardId:cardActive._id, data: data})).unwrap(), {
            pending: 'Adding comment...',
            success: 'Add comment successful!',
            error: 'Error adding comment',
          })
          .then((res) => {
            console.log('rescomment' , res)
              reset();
          })
          .catch((err) => {
            console.error('Login error:', err);
          });
  
  }

  return (
   <Box sx={{width:'100%'}}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2}}>
      <CommentOutlinedIcon/>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' ,fontSize: '1.25rem', color: 'text.primary' }}>
        Comments
      </Typography>
    </Box>
    <Box sx={{mt:3 ,display:'flex', alignItems:'center' ,gap:2}}>
      <Avatar
        alt="Remy Sharp"
        src={userdata?.user?.avatar}
        sx={{ border: 'none' }}/>   

      <Box
       component="form"
      sx={{ '& > :not(style)': {  width: '100%' } ,flex:1 }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(handerComment)}
      >
       <TextField id="outlined-basic" label="Your comment" variant="outlined" fullWidth 
       sx={{
          '.css-ka3rzy-MuiFormLabel-root-MuiInputLabel-root.Mui-focused':{
                color:'#99C2FF'
              },
              '.css-13nxshs-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':{
                borderColor:'#99C2FF'
              }
        
        }}
         {...register('content', {
            required: ROLE_MESSAGES,
          })}
         />
      </Box>
    </Box>

    {/* all comment */}

    <Box sx={{mt:5}}>
      {!commentData  ?
        <Box sx={{display:'flex', justifyContent:'center'}}>
          <Typography sx={{color:'gray'}}>No commment found!</Typography>
        </Box>

       : <Box sx={{display:'flex', flexDirection:'column' , gap:2 , mt:2}}>
        {
          commentData.map((comment)=>{
            return(
            <Box sx={{display:'flex', gap:2}}>
            <Avatar sx={{mt:1}} src={comment.avatar}/>
            <Box sx={{width:'100%'}}>
              <Typography sx={{fontWeight:'bold'}}>Name user</Typography>
              <Typography variant="body1" sx={{p:2, border:'1px solid',borderColor:'grey.300' , borderRadius:'5px',width:'100%'}}>{comment.content}</Typography>
            </Box>
          </Box>
            )
             
          })
        }
         
        </Box>}
    </Box>
   </Box>
  )
}

export default UserGroupComment