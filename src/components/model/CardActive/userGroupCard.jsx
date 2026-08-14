import { Box } from "@mui/material"
import { useState } from "react"
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useSelector } from "react-redux";
import { selectCurrentActiveBoard } from '../../../redux/activeBoard/activeBoardSlice'
import AddIcon from '@mui/icons-material/Add';
import { CARD_MEMBER_ACTION } from '../../../utils/constants'
import Badge from '@mui/material/Badge';
import CheckIcon from '@mui/icons-material/Check';
import { updateCardDetail } from '../../../redux/CardActivity/cardActiveSlice'
import { useDispatch } from 'react-redux'
import { useEffect } from "react";
export const UserGroupCard = ({ cardMemberIds = [], cardId }) => {
    const dispatch = useDispatch()
    const boardData = useSelector(selectCurrentActiveBoard)
    const limit = 4;
    const [anchorEl, setAnchorEl] = useState(null);
    const handleTogglePopover = (event) => {
    if (anchorEl) {
        setAnchorEl(null);
    } else {
        setAnchorEl(event.currentTarget);
    }
    };
    const  cardMembers = cardMemberIds.map((memberId) => {
        return boardData?.Fe_allUser.find((user) => user._id === memberId);
    })

    const shouldShowAdd =
        !cardMembers ||
        cardMembers.length === 0 ||
        cardMembers.length > limit ||
        cardMemberIds.length !== boardData?.Fe_allUser?.length;

    const open = Boolean(anchorEl) && shouldShowAdd;

    const IsMember = (userId) => {
        return cardMemberIds.includes(userId);
    }

    const handlerActionMember = (userId) => {
        const action = IsMember(userId) ? CARD_MEMBER_ACTION.REMOVE : CARD_MEMBER_ACTION.ADD;
        const data = {
            updateMemberCard: {
                userId: userId,
                action: action,

            }
        }
        dispatch(updateCardDetail({ CardId: cardId, data }))
    }

    useEffect(() => {
        if (
            cardMembers?.length <= limit &&
            cardMemberIds?.length === boardData?.Fe_allUser?.length
        ) {
            setAnchorEl(null);
        }
    }, [cardMembers, cardMemberIds, boardData]);
  
    return (
        <Box
            sx={{
                display: 'flex',

            }}
        >
            {cardMembers?.slice(0, limit).map((user, index) => {
                return (
                    <Tooltip title={user.displayName} key={index} onClick={() => handlerActionMember(user._id)}>
                        <Badge
                            badgeContent={IsMember(user._id) ? (
                                <CheckIcon sx={{ fontSize: '12px', color: '#fff' }} />
                            ) : null}
                            color="primary"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            sx={{
                                '& .MuiBadge-badge': {
                                    height: '18px',
                                    minWidth: '18px',
                                    borderRadius: '50%',
                                    padding: 0,
                                }
                            }}
                        >
                            <Avatar
                                alt="Remy Sharp"
                                src={user?.avatar}
                                sx={{ border: 'none' }}
                            />
                        </Badge>
                    </Tooltip>)
            }
            )}
            {(!cardMembers || cardMembers.length === 0 || cardMembers?.length > limit || cardMemberIds?.length !== boardData?.Fe_allUser?.length) && (
                <Tooltip title="Show more users" onClick={handleTogglePopover} sx={{ ml: 0.5 }}>
                    <Avatar>
                        <AddIcon />
                    </Avatar>
                </Tooltip>)}

            <Popover
                id={ open ? 'simple-popover' : undefined}
                open={open}
                anchorEl={anchorEl}
                onClose={handleTogglePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{
                    '& .MuiPopover-paper': {
                        maxWidth: 300,
                        maxHeight: 400,
                        overflowY: 'auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        p: 1,
                        gap: 1,
                    },
                }}
            >
                {boardData?.Fe_allUser.map((user, index) => {
                    return (
                        <Tooltip title={user.displayName} key={index} onClick={() => handlerActionMember(user._id)}>
                            <Badge
                                badgeContent={IsMember(user._id) ? (
                                    <CheckIcon sx={{ fontSize: '12px', color: '#fff' }} />
                                ) : null}
                                color="primary"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        height: '18px',
                                        minWidth: '18px',
                                        borderRadius: '50%',
                                        padding: 0,
                                    }
                                }}
                            >
                                <Avatar
                                    alt="Remy Sharp"
                                    src={user?.avatar}
                                    sx={{ border: 'none' }}
                                />
                            </Badge>
                        </Tooltip>)
                }
                )}

            </Popover>

        </Box>
    );
};
