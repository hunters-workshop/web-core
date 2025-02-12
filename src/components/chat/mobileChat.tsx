import { Box, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import { ChatOverview } from './chatOverview'
import { ChatSection } from './chatSection'
import useSafeInfo from '@/hooks/useSafeInfo'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export const MobileChat = () => {
  const [mobileValue, setMobileValue] = React.useState(0)

  const { safe } = useSafeInfo()
  const owners = safe?.owners || ['']

  const handleMobileChange = (event: React.SyntheticEvent, newValue: number) => {
    setMobileValue(newValue)
  }

  return (
      <Box sx={{ width: '100%', height: '100%' }}>
        <Tabs variant="fullWidth" value={mobileValue} onChange={handleMobileChange} aria-label="responsive tabs">
          <Tab label="Timeline" {...a11yProps(0)} />
          <Tab label="Overview" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={mobileValue} index={0}>
          <ChatSection />
        </TabPanel>
        <TabPanel value={mobileValue} index={1}>
          <Box height="100%">
            <ChatOverview owners={owners} />
          </Box>
        </TabPanel>
      </Box>
  )
}
