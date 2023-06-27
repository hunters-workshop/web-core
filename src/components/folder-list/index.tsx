import { AppRoutes } from '@/config/routes';
import { useAllOwnedSafes } from '@/hooks/useAllOwnedSafes';
import useSafeInfo from '@/hooks/useSafeInfo';
import { useAppSelector } from '@/store';
import { selectSafe, setSelectedSafe } from '@/store/chatServiceSlice';
import { ListItem, ListItemButton, Typography, useMediaQuery } from '@mui/material';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ellipsisAddress from '../../utils/ellipsisAddress';
import Identicon from '../common/Identicon';
import FolderListContextMenu from './folderItemContextItem';

const FolderList: React.FC = () => {
  const matches = useMediaQuery('(max-width: 600px)')
  const dispatch = useDispatch()
  const selectedSafe = useAppSelector((state) => selectSafe(state))
  const allOwnedSafes = useAllOwnedSafes()
  const [safeFolder, setSafeFolder] = useState<string[]>([])
  const { safeAddress } = useSafeInfo()
  const [activeSafe, setActiveSafe] = useState<string>();

  //TODO: can be signficantly refactored
  useEffect(() => {
    if (allOwnedSafes?.size) {
      let folderList: string[] = []
      //getting pre-fix for all networks and creating links
      allOwnedSafes.get(42161)?.forEach((safe: string) => folderList.push(`arb1:${safe}`))
      allOwnedSafes.get(56)?.forEach((safe: string) => folderList.push(`bnb:${safe}`))
      allOwnedSafes.get(100)?.forEach((safe: string) => folderList.push(`gno:${safe}`))
      allOwnedSafes.get(137)?.forEach((safe: string) => folderList.push(`matic:${safe}`))
      allOwnedSafes.get(10)?.forEach((safe: string) => folderList.push(`oeth:${safe}`))
      allOwnedSafes.get(1)?.forEach((safe: string) => folderList.push(`eth:${safe}`))
      if (!folderList) {
        return
      }
      setSafeFolder(folderList)
    }
  }, [allOwnedSafes])


  const CustomListItem = styled(ListItem)(({ theme }) => ({
    '&&.Mui-selected': {
      backgroundColor: theme.palette.background.paper,
      borderLeft: '5px solid #FE7E51'
    },
    '&&:hover': {
      backgroundColor: theme.palette.border.light
    },
  }))

  const matchSafe = (safe: string) => {
    return safe.slice(safe.lastIndexOf(':') + 1) === safeAddress
  }
  const handleMouseEnter = (safe: string) => {
    setActiveSafe(safe)
  };
  const handleMouseLeave = () => {
    setActiveSafe(undefined)
  };
  const handleClick = (safe: string) => {
    dispatch(setSelectedSafe({ selectedSafe: safe }))
  }

  return (
    <List sx={{ padding: '0px' }}>
      {safeFolder?.map((safe, index) => (
        <CustomListItem key={`${safe}-${index}`} selected={matchSafe(safe)} onMouseOver={(e) => handleMouseEnter(safe)} onMouseLeave={handleMouseLeave}>
          <Link href={{ pathname: AppRoutes.chat, query: { safe: `${safe}` } }} key={`${safe}-${index}`} passHref>
            <ListItemButton
              key={`safe-${index}`}
              onClick={(e) => handleClick(safe)}
              sx={{
                padding: '2px 6px', minHeight: '69px',
                "&:hover": {
                  backgroundColor: "transparent"
                }
              }}
              disableRipple
            >
              <ListItemAvatar>
                <Identicon address={safe.slice(safe.lastIndexOf(':') + 1)} radius={6} size={32} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 500 }}>{ellipsisAddress(safe)}</Typography>}
              />
            </ListItemButton>
          </Link>
          {(activeSafe === safe || selectedSafe === safe || matches) && <FolderListContextMenu address={safe} />}
        </CustomListItem>
      ))
      }
    </List >
  )
}

export default memo(FolderList)