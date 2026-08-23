import React from 'react'
import {
    Box,
    Typography,
    Button,
    Chip,
    Stack,
    Tooltip,
    Badge
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useState } from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Popover from '@mui/material/Popover';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAllNotification,
    selectAllNotification,
    updateNotification,
    addNotification
} from '~/redux/Notification/NotificationSlice'
import { useEffect } from 'react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { socketInstance } from "~/main"
import { selectUserData } from '~/redux/user/userSlice'

export const BOARD_INVITATION_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
}

const NotificationForm = () => {
    const dispatch = useDispatch()
    const userdata = useSelector(selectUserData)
    const [anchorEl, setAnchorEl] = useState(null);
    const [newNotifi, setNewNotifi] = useState(false)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const dataNotification = useSelector(selectAllNotification)
    const boardData = useSelector(selectCurrentActiveBoard)
    console.log(dataNotification)

    useEffect(() => {
        dispatch(fetchAllNotification())
    }, [dispatch])

    useEffect(() => {
        if (!userdata?.user?._id) return
        console.log('user._id', userdata.user._id)

        const onReceiveNewInvitation = (invitation) => {
            console.log('invitation', invitation.invitee)
            if (invitation?.invitee === userdata.user._id) {
                console.log('invitation.invitee')
                dispatch(addNotification(invitation))
                setNewNotifi(true)
            }
        }

        socketInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
        console.log('set new notifi ', newNotifi)
        return () => {
            socketInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
        }
    }, [dispatch, userdata?.user._id])

    const handlerAction = async (action, item) => {
        const data = {
            "boardInvitation": {
                "boardId": item.boardData[0]._id,
                "status": action
            }
        }
        const id = item._id
        console.log(data, id)
        dispatch(updateNotification({ data, id }))
    }




    return (

        <Box>
            <Tooltip title="Notifigation" aria-describedby={id} onClick={handleClick}>
                <Badge
                    color="warning"
                    variant={newNotifi ? 'dot' : 'none'}
                    sx={{ cursor: 'pointer', color: '#fff' }}
                >
                    <NotificationsNoneIcon sx={{ color: newNotifi ? 'yellow' : 'white' }} onClick={() => setNewNotifi(false)} />
                </Badge>
            </Tooltip>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',

                }}
                PaperProps={{
                    sx: {
                        width: 300,
                        mt: 2,
                        p: 2,
                        minHeight: 50


                    },
                }}
            >
                {dataNotification && dataNotification.length > 0
                    ? (dataNotification.map((item) => {
                        return (
                            <Box
                                sx={{
                                    p: 2,
                                    borderBottom: '1px solid #eee',

                                }}
                            >

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <GroupAddIcon />
                                    <Typography sx={{ mb: 1 }}>
                                        <b> {item?.inviterData?.[0]?.displayName || 'Someone'}</b> had invited you to join the board <b> {item?.boardData?.[0]?.title || 'a board'} </b>
                                    </Typography>
                                </Box>

                                {/* Action */}
                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end" sx={{ display: 'flex', width: '100%' }}>
                                    {item.boardInvitation.status == BOARD_INVITATION_STATUS.PENDING &&
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }} >
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={() => handlerAction(BOARD_INVITATION_STATUS.ACCEPTED, item)}
                                            // disabled={status !== 'pending'}
                                            >
                                                Accept
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                onClick={() => handlerAction(BOARD_INVITATION_STATUS.REJECTED, item)}
                                            // disabled={status !== 'pending'}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    }
                                    {/* Status */}
                                    {item.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED && (
                                        <Chip
                                            icon={<CheckCircleIcon />}
                                            label="Accepted"
                                            color="success"
                                            size="small"

                                        />
                                    )}

                                    {item.boardInvitation.status == BOARD_INVITATION_STATUS.REJECTED && (
                                        <Chip
                                            icon={<CancelIcon />}
                                            label="Rejected"
                                            color="default"
                                            size="small"
                                        />
                                    )}
                                </Stack>

                                {/* Time */}
                                {/* <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {createdAt}
                </Typography> */}
                            </Box>)
                    }
                    ))
                    : <Typography sx={{ mt: 1, color: 'gray', textAlign: 'center' }}>
                        No notification!!
                    </Typography>
                }
            </Popover>
        </Box>
    )
}

export default NotificationForm