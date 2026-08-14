import React, { useState } from 'react'
import { Button } from '@mui/material'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CancelIcon from '@mui/icons-material/Cancel';
import Grid from '@mui/material/Grid';
import CardActivitySection from './CardActivitySection'
import EditableTitle from '../../Form/ToggleTextfile'
import UserGroupComment from './CardActivityUserGroupComment'
import CardActivityEditor from './CardActivityEditor'
import { GroupUserAvatar } from '../../Boards/UerGroupAvatar';
import { useSelector, useDispatch } from 'react-redux';
import { selectCardActive, removeCardActive } from '../../../redux/CardActivity/cardActiveSlice'
import { updateCardDetail } from '../../../redux/CardActivity/cardActiveSlice'
import { toast } from 'react-toastify';
import { updateCardAction } from '../../../redux/activeBoard/activeBoardSlice'
import { selectUserData } from '~/redux/user/userSlice'
import { UserGroupCard } from './userGroupCard'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const CardActions = () => {
  const dispatch = useDispatch()
  const cardActive = useSelector(selectCardActive)
  const userData = useSelector(selectUserData)
  console.log("user", userData?.user.avatar)
  const handleClose = () => {
    dispatch(removeCardActive())
  }
  const style = {
    width: '90%',
    maxWidth: 900,
    bgcolor: 'background.paper',
    borderRadius: 3,
    p: 3,
    position: 'absolute', // Giữ cái này để nút CancelIcon có thể bám vào góc trên bên phải của Box này
    outline: 'none'

  };


  const updateTitleColumn = (newTitle) => {
    const data = {
      title: newTitle,
    }
    console.log(data)
    const result = dispatch(updateCardDetail({ CardId: cardActive._id, data })).then(() => {
      toast.success('Updated title')
      dispatch(updateCardAction({ ...data, columnId: cardActive.columnId, id: cardActive._id }))
    })
    console.log('newTitle', newTitle)
  }
  return (
    <Box  >
      <Modal
        open={cardActive}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          overflowY: 'auto', // Kích hoạt cuộn toàn màn hình khi nội dung dài
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start', // Đẩy modal lên sát đỉnh đầu để cuộn xuống dưới
          py: 5, // Tạo khoảng cách trống ở đầu và cuối trang cho dễ nhìn (40px)
        }}
      >
        <Box sx={style} >

          {cardActive?.cover ?
            <Box sx={{ width: '100%', height: 250, overflow: 'hidden', mb: 2, borderRadius: 2, mt: 2 }}>
              <img src={cardActive.cover}
                alt="Modal Image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                }} />
            </Box>
            :
            <Box sx={{ display: 'flex', justifyContent: 'center', height: '100px', alignItems: 'center' }}>

              <Typography sx={{ color: 'grey' }}>No cover is found!</Typography>
            </Box>
          }
          <CancelIcon sx={{ position: 'absolute', top: 5, right: 5, cursor: 'pointer' }} onClick={handleClose} />
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 9 }}>

              <EditableTitle initialValue={cardActive?.title} onChange={updateTitleColumn} />
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.title' }}>
                  Members
                </Typography>
                <UserGroupCard cardMemberIds={cardActive?.membersIds} cardId={cardActive?._id} />
              </Box>
              <CardActivityEditor cardActive={cardActive} />
              <UserGroupComment userdata={userData} cardActive={cardActive} />

            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <CardActivitySection cardActive={cardActive} cardId={cardActive?._id} />
            </Grid>
          </Grid>

        </Box>
      </Modal>
    </Box>
  )
}
