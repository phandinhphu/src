import { createContext, useContext, useMemo, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { useFirestore } from '../hooks/useFirestore';

export const AppContext = createContext();

function AppProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    const {
        user: { uid },
    } = useContext(AuthContext);

    // room
    /**
     * {
     *  name: 'room name',
     *  description: 'room description',
     *  members: ['uid1', 'uid2'],
     * }
     */
    const roomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid,
        };
    }, [uid]);

    const rooms = useFirestore('rooms', roomsCondition);

    const selectedRoom = useMemo(
        () => rooms?.find((room) => room.id === selectedRoomId) || {},
        [rooms, selectedRoomId],
    );

    // members
    const membersCondition = useMemo(() => {
        return selectedRoom?.members
            ? {
                  fieldName: 'uid',
                  operator: 'in',
                  compareValue: selectedRoom.members,
              }
            : null;
    }, [selectedRoom.members]);

    const members = useFirestore('users', membersCondition);

    console.log({ rooms, selectedRoom, members });

    return (
        <AppContext.Provider
            value={{
                rooms,
                members,
                selectedRoom,
                isAddRoomVisible,
                setIsAddRoomVisible,
                selectedRoomId,
                setSelectedRoomId,
                isInviteMemberVisible,
                setIsInviteMemberVisible,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
