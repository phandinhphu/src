import { useContext, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { query, where, orderBy, limit, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Modal, Form, Select, Spin, Avatar } from 'antd';

import { db, collection } from '../../firebase/config';
import { AppContext } from '../../context/AppProvider';

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, props.currentMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, props]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
        >
            {
                // [{ label, value, photoURL }]
                options.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                        <Avatar size="small" src={opt.photoURL}>
                            {opt.photoURL ? '' : opt.displayName?.charAt(0).toUpperCase()}
                        </Avatar>
                        {`${opt.label}`}
                    </Select.Option>
                ))
            }
        </Select>
    );
}

async function fetchUserList(search, currentMembers) {
    const q = query(
        collection(db, 'users'),
        where('keywords', 'array-contains', search),
        orderBy('displayName'),
        limit(20),
    );

    const result = await getDocs(q);
    return result.docs
        .map((doc) => ({
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL,
        }))
        .filter((opt) => !currentMembers.includes(opt.value));
}

function InviteMember() {
    const [value, setValue] = useState([]);
    const { isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, selectedRoom } = useContext(AppContext);

    const [form] = Form.useForm();

    const handleOk = async () => {
        // Reset form value
        form.resetFields();

        // Add new member to current room
        const roomRef = doc(db, 'rooms', selectedRoomId);

        await updateDoc(roomRef, {
            members: [...selectedRoom.members, ...value.map((val) => val.value)],
        });

        setIsInviteMemberVisible(false);
    };

    const handleCancel = () => {
        // Reset form value
        form.resetFields();

        setIsInviteMemberVisible(false);
    };

    console.log({ selectedRoom, value });

    return (
        <div>
            <Modal title="Mời thêm thành viên" open={isInviteMemberVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="vertical" form={form}>
                    <DebounceSelect
                        mode="multiple"
                        name="members"
                        label="Tên thành viên"
                        value={value}
                        placeholder="Nhập tên thành viên"
                        style={{ width: '100%' }}
                        currentMembers={selectedRoom.members}
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                    />
                </Form>
            </Modal>
        </div>
    );
}

export default InviteMember;
