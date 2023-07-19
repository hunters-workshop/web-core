import { type Transaction, type TransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import { Accordion, AccordionDetails, AccordionSummary, Box, Skeleton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TxSummary from '@/components/transactions/TxSummary'
import TxDetails from '@/components/transactions/TxDetails'
import CreateTxInfo from '@/components/transactions/SafeCreationTx'
import { isCreationTxInfo } from '@/utils/transaction-guards'
import { useContext } from 'react'
import { BatchExecuteHoverContext } from '@/components/transactions/BatchExecuteButton/BatchExecuteHoverProvider'
import css from './styles.module.css'
import classNames from 'classnames'

type ExpandableTransactionItemProps = {
  isGrouped?: boolean
  item: Transaction
  txDetails?: TransactionDetails
}

export const ExpandableTransactionItem = ({
  isGrouped = false,
  item,
  txDetails,
  testId,
}: ExpandableTransactionItemProps & { testId?: string }) => {
  const hoverContext = useContext(BatchExecuteHoverContext)

  const isBatched = hoverContext.activeHover.includes(item.transaction.id)

  return (
    <Accordion
      disableGutters
      TransitionProps={{
        mountOnEnter: true,
        unmountOnExit: false,
      }}
      elevation={0}
      defaultExpanded={!!txDetails}
      className={classNames(css.accordion, { [css.batched]: isBatched })}
      data-testid={testId}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'flex-start', overflowX: 'auto', padding: '0' }}>
        <TxSummary item={item} isGrouped={isGrouped} className={css.nomargintxsummary} />
      </AccordionSummary>

      <AccordionDetails sx={{ padding: 0 }}>
        {isCreationTxInfo(item.transaction.txInfo) ? (
          <CreateTxInfo txSummary={item.transaction} />
        ) : (
          <TxDetails txSummary={item.transaction} txDetails={txDetails} />
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export const TransactionSkeleton = () => (
  <>
    <Box pt="20px" pb="4px">
      <Skeleton variant="text" width="35px" />
    </Box>

    <Accordion disableGutters elevation={0} defaultExpanded className={css.accordion}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'flex-start', overflowX: 'auto', padding: '0' }}>
        <Skeleton width="100%" />
      </AccordionSummary>

      <AccordionDetails sx={{ padding: 0 }}>
        <Skeleton variant="rounded" width="100%" height="325px" />
      </AccordionDetails>
    </Accordion>
  </>
)

export default ExpandableTransactionItem
