import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSafeInfo from '@/hooks/useSafeInfo'
import { initSafeSDK, setSafeSDK } from '@/hooks/coreSDK/safeCoreSDK'
import { trackError } from '@/services/exceptions'
import ErrorCodes from '@/services/exceptions/ErrorCodes'
import { useAppDispatch } from '@/store'
//import { showNotification } from '@/store/notificationsSlice'
import { useWeb3ReadOnly } from '@/hooks/wallets/web3'
import { parsePrefixedAddress, sameAddress } from '@/utils/addresses'

export const useInitSafeCoreSDK = () => {
  const { safe, safeLoaded } = useSafeInfo()
  const dispatch = useAppDispatch()
  const web3ReadOnly = useWeb3ReadOnly()

  const { query } = useRouter()
  const prefixedAddress = Array.isArray(query.safe) ? query.safe[0] : query.safe
  const { address } = parsePrefixedAddress(prefixedAddress || '')

  useEffect(() => {
    if (!safeLoaded || !web3ReadOnly || !sameAddress(address, safe.address.value)) {
      // If we don't reset the SDK, a previous Safe could remain in the store
      setSafeSDK(undefined)
      return
    }

    // A read-only instance of the SDK is sufficient because we connect the signer to it when needed
    initSafeSDK({
      provider: web3ReadOnly,
      chainId: safe.chainId,
      address: safe.address.value,
      version: safe.version,
      implementationVersionState: safe.implementationVersionState,
      implementation: safe.implementation.value,
    })
      .then(setSafeSDK)
      .catch((e) => {
      /* dispatch(
          showNotification({
            message: 'Please try connecting your wallet again.',
            groupKey: 'core-sdk-init-error',
            variant: 'error',
            detailedMessage: (e as Error).message,
          }),
        ) */
        trackError(ErrorCodes._105, (e as Error).message)
      })
  }, [
    address,
    dispatch,
    safe.address.value,
    safe.chainId,
    safe.implementation.value,
    safe.implementationVersionState,
    safe.version,
    safeLoaded,
    web3ReadOnly,
  ])
}
