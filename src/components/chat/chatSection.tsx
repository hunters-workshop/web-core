import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, List, ListItem, useMediaQuery, Button, ListItemAvatar } from '@mui/material';
import { getMessages, listenForMessage, fetchMoreMessages } from '../../services/chat';
import { setChat, selectGroup, selectUserItem } from '@/store/chatServiceSlice';
import useSafeAddress from '@/hooks/useSafeAddress';
import useTxHistory from '@/hooks/useTxHistory';
import useTxQueue from '@/hooks/useTxQueue';
import useWallet from '@/hooks/wallets/useWallet';
import ChatMessage from './chatMessage';
import ChatTextField from './chatTextField';
import TxListItemChat from '../transactions/TxListItemChat';
import { type TransactionListItem } from '@safe-global/safe-gateway-typescript-sdk';

interface IDataItem {
  data: any;
  timestamp: number;
  type: string;
}

interface IMessage {
  id: string;
  sentAt: string;
  sender?: any;
}

//load more stuff
const fetchMore = async (
  id: string,
  messages: any[] | undefined,
  dispatch: any,
  setMessages: any,
  setMoreMessages: any,
  setDisplayAmount: any,
  displayAmount: number
) => {
  try {
    const msgs: IMessage[] | any = await fetchMoreMessages(`pid_${id}`, messages || []);
    console.log(msgs, 'msgs')
    dispatch(setChat({ safeAddress: id, messages: msgs }));
    if (msgs.length < 20) setMoreMessages(false);
    setMessages([...msgs, ...messages || []])
    setDisplayAmount(displayAmount + 20);
  } catch (e) {
    console.log(e, 'cant fetch more messages');
  }
}

// extracted out of the component
const fetchMessages = async (
  id: string,
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | any>>,
  dispatch: any, 
) => {
  try {
    const msgs: IMessage[] | any = await getMessages(`pid_${id}`);
    dispatch(setChat({ safeAddress: id, messages: msgs }));
    setMessages(msgs || ['']);
  } catch (error) {
    setMessages([]);
  }
};

const listenToMessages = async (id: string, setMessages: React.Dispatch<React.SetStateAction<IMessage[] | any>>) => {
  try {
    const msg: IMessage | any = await listenForMessage(`pid_${id}`);
    setMessages((prevState: IMessage[]) => [...prevState, msg]);
  } catch (error) {
    console.log(error);
  }
};

export const ChatSection: React.FC<{ drawerWidth?: number, drawerOpen?: boolean }> = ({ drawerWidth, drawerOpen }) => {
  const matches = useMediaQuery('(min-width:901px)');
  // state
  const dispatch = useDispatch();
  const group = useSelector(selectGroup);
  const user = useSelector(selectUserItem);
  // transactions
  const txHistory = useTxHistory();
  const txQueue = useTxQueue();
  const wallet = useWallet();
  // chat
  const [messages, setMessages] = useState<any[] | undefined>();
  const [chatData, setChatData] = useState<IDataItem[]>([]);
  const safeAddress = useSafeAddress();
  const bottom = useRef<HTMLDivElement>(null);
  const [moreMessages, setMoreMessages] = useState(true);
  const [displayAmount, setDisplayAmount] = useState(20);
  const historyItems: TransactionListItem[] = txHistory?.page?.results || [];
  const queueItems: TransactionListItem[] = txQueue?.page?.results || [];

  useEffect(() => {
    if (displayAmount > 20) return 
    const { current } = bottom;
    current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatData, messages]);

  useEffect(() => {
    if (safeAddress) {
      fetchMessages(`pid_${safeAddress}`, setMessages, dispatch);
      listenToMessages(`pid_${safeAddress}`, setMessages);
    }
  }, [safeAddress, user, group]);

  useEffect(() => {
    const allData: IDataItem[] = [];
    if (!messages?.length) return
    historyItems?.forEach((tx: any) => {
      if (tx.type !== 'DATE_LABEL') {
        allData.push({
          data: tx,
          timestamp: tx.transaction.timestamp,
          type: 'tx',
        });
      }
    });

    queueItems?.forEach((tx: any) => {
      if (tx.type !== 'LABEL' && tx.type !== 'CONFLICT_HEADER') {
        allData.push({
          data: tx,
          timestamp: tx.transaction.timestamp,
          type: 'tx',
        });
      }
    });

    if (messages?.length) {
      messages.forEach((message: IMessage) => {
        allData.push({
          data: message,
          timestamp: +message.sentAt * 1000,
          type: 'message',
        });
      });
    }
    allData.sort((a, b) => a.timestamp - b.timestamp);
    setChatData(allData);
  }, [messages?.length, safeAddress]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: '100%', overflowY: 'auto' }} id="chat-window">
        <Box
          sx={{
            flex: '1 0 auto',
            display: 'flex',
            minHeight: '85vh',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
            gap: '16px',
            p: '0 24px',
          }}
        >
          <List>
            {/* @todo: pls make this look/feel better */}
            {moreMessages ? (
            <Button onClick={
              () => fetchMore(safeAddress, messages, dispatch, setMessages, setMoreMessages, setDisplayAmount, displayAmount)
            }>
              click to load more
            </Button>
            ) : (
              <div>Beginning of conversation.</div>
            )
          }
            {chatData.slice(-displayAmount).map((chat: IDataItem) => {
              if (chat.type === 'message' && chat?.data?.sender) {
                return <ChatMessage key={chat.data.id} chat={chat} wallet={wallet} />;
              } else if (chat.type === 'tx') {
                if (matches) {
                  if (drawerOpen) {
                return (
                  <ListItem
                    key={chat.data.transaction.id}
                    sx={{ margin: '8px 0px', padding: '6px 0px', width: 'calc(100vw - 695px)' }}
                    alignItems="flex-start"
                    disableGutters
                  >
                    		<ListItemAvatar sx={{ minWidth: 32, pr: '16px' }}>
						<svg height="32px" width="32px"><image href="/images/actual-safe-logo-green.png" /></svg>
		</ListItemAvatar>
                    <TxListItemChat item={chat?.data} />
                  </ListItem>
                )
              } else {
                return (
                  <ListItem
                    key={chat.data.transaction.id}
                    sx={{ margin: '8px 0px', padding: '6px 0px', width: `calc(100vw - (695px - ${drawerWidth}px))` }}
                    alignItems="flex-start"
                    disableGutters
                  >
                    
                    <TxListItemChat item={chat?.data} />
                  </ListItem>
                )
              }
              } else {
                  return (
                  <ListItem
                    key={chat.data.transaction.id}
                    sx={{ margin: '8px 0px', padding: '6px 0px', width: 'calc(100vw - 48px)' }}
                    alignItems="flex-start"
                    disableGutters
                  >
                    
                    <TxListItemChat item={chat?.data} />
                    </ListItem>
                    )
                  }
                }
              })}
            <div ref={bottom} />
            {!chatData.length && <ListItem>Beginning of Conversation</ListItem>}
          </List>
        </Box>
      </Box>
      <Box
        sx={{
          flexShrink: 0,
          position: 'sticky',
          bottom: 0,
          p: '0px 24px 12px 24px',
          background: 'var(--color-background-lightcolor)',
        }}
      >
        {user && group && <ChatTextField currentUser={user} messages={messages || []} setMessages={setMessages} />}
      </Box>
    </Box>
  );
};
