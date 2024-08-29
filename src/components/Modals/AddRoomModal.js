import { useContext } from 'react';
import { Modal, Form, Input } from 'antd';
import { AppContext } from '../../context/AppProvider';
import { AuthContext } from '../../context/AuthProvider';
import { addDocument } from '../../firebase/services';

function AddRoomModal() {
    const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);

    const {
        user: { uid },
    } = useContext(AuthContext);
    const [form] = Form.useForm();

    const handleOk = async () => {
        // Add new room to firestore
        const docRef = await addDocument('rooms', {
            ...form.getFieldsValue(),
            members: [uid],
        });
        console.log('New room id: ', docRef.id);

        // Reset form value
        form.resetFields();

        setIsAddRoomVisible(false);
    };

    const handleCancel = () => {
        // Reset form value
        form.resetFields();

        setIsAddRoomVisible(false);
    };

    return (
        <div>
            <Modal title="Tạo phòng" open={isAddRoomVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="vertical" form={form}>
                    <Form.Item label="Tên phòng" name="name">
                        <Input placeholder="Nhập tên phòng" />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea placeholder="Nhập mô tả" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default AddRoomModal;
