import React from 'react';
import './CustomerCareTab.css';

// Import Modular Sub-components
import ConsultationsPanel from './ConsultationsPanel';
import ChatSupportPanel from './ChatSupportPanel';
import DueRemindersPanel from './DueRemindersPanel';
import OverdueCollectionsPanel from './OverdueCollectionsPanel';

const CustomerCareTab = ({ consultations, handleResolveTicket, chats, setChats, showOnly, users }) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      {/* Dynamic Sub-tab views based on selection */}
      {(!showOnly || showOnly === 'consultation') && (
        <ConsultationsPanel 
          consultations={consultations} 
          handleResolveTicket={handleResolveTicket} 
        />
      )}
      {showOnly === 'chat' && (
        <ChatSupportPanel 
          chats={chats} 
          setChats={setChats} 
          users={users}
        />
      )}
      {showOnly === 'reminders' && (
        <DueRemindersPanel />
      )}
      {showOnly === 'collections' && (
        <OverdueCollectionsPanel />
      )}
    </div>
  );
};

export default CustomerCareTab;
