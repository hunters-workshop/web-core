import { useEffect, useRef, type ReactElement } from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Link from 'next/link'
import classnames from 'classnames'

import css from './styles.module.css'
import SafeIcon from '@/components/common/SafeIcon'
import { useAppSelector } from '@/store'
import useSafeAddress from '@/hooks/useSafeAddress'
import { selectChainById } from '@/store/chainsSlice'
import SafeListItemSecondaryAction from '@/components/sidebar/SafeListItemSecondaryAction'
import useChainId from '@/hooks/useChainId'
import { AppRoutes } from '@/config/routes'
import SafeListContextMenu from '@/components/sidebar/SafeListContextMenu'
import Box from '@mui/material/Box'
import { selectAllAddressBooks } from '@/store/addressBookSlice'
import EthHashInfo from '@/components/common/EthHashInfo'
import { sameAddress } from '@/utils/addresses'

const SafeListItem = ({
  address,
  chainId,
  closeDrawer,
  shouldScrollToSafe,
  ...rest
}: {
  address: string
  chainId: string
  closeDrawer: () => void
  shouldScrollToSafe: boolean
  threshold?: string | number
  owners?: string | number
}): ReactElement => {
  const safeRef = useRef<HTMLDivElement>(null)
  const safeAddress = useSafeAddress()
  const chain = useAppSelector((state) => selectChainById(state, chainId))
  const allAddressBooks = useAppSelector(selectAllAddressBooks)
  const currChainId = useChainId()
  const isCurrentSafe = currChainId === currChainId && safeAddress.toLowerCase() === address.toLowerCase()
  const name = allAddressBooks[chainId]?.[address]
  const isOpen = sameAddress(address, safeAddress)
  const shortName = chain?.shortName || ''

  // Scroll to the current Safe
  useEffect(() => {
    if (isCurrentSafe && shouldScrollToSafe) {
      safeRef.current?.scrollIntoView({ block: 'center' })
    }
  }, [isCurrentSafe, shouldScrollToSafe])

  return (
    <ListItem
      className={css.container}
      disablePadding
      secondaryAction={
        <Box display="flex" alignItems="center" gap={1}>
          <SafeListItemSecondaryAction
            chainId={chainId}
            address={address}
            onClick={closeDrawer}
            href={`${AppRoutes.load.safe}?chain=${shortName}&address=${shortName}:${address}`}
          />
          <SafeListContextMenu name={name} address={address} chainId={chainId} />
        </Box>
      }
    >
      <Link href={`${AppRoutes.safe.home}?safe=${shortName}:${address}`} passHref>
        <ListItemButton
          key={address}
          onClick={closeDrawer}
          selected={isOpen}
          className={classnames(css.safe, { [css.open]: isOpen })}
          ref={safeRef}
        >
          <ListItemIcon>
            <SafeIcon address={address} {...rest} />
          </ListItemIcon>
          <ListItemText
            sx={{ pr: 10 }}
            primaryTypographyProps={{
              variant: 'body2',
              component: 'div',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            secondaryTypographyProps={{ component: 'div' }}
            primary={name || ''}
            secondary={<EthHashInfo address={address} showAvatar={false} showName={false} prefix={shortName} />}
          />
        </ListItemButton>
      </Link>
    </ListItem>
  )
}

export default SafeListItem