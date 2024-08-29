import styled from 'styled-components';
import { useContext, useMemo, useState } from 'react';

import { UserAddOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Form, Input, Tooltip } from 'antd';
import Message from './Message';
import { AppContext } from '../../context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../context/AuthProvider';
import { useFirestore } from '../../hooks/useFirestore';

const WrapperStyled = styled.div`
    height: 100vh;
`;

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 0 16px;
    border-bottom: 1px solid rgb(230, 230, 230);

    .header {
        &__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &__title {
            margin: 0;
            font-weight: bold;
        }

        &__desc {
            font-size: 12px;
        }
    }
`;

const ButtonGroupStyled = styled.div`
    display: flex;
    align-items: center;
`;

const ContentStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 11px;
    height: calc(100% - 79px);
`;

const MessageListStyled = styled.div`
    max-height: 100%;
    overflow-y: auto;
`;

const FormStyled = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 2px 0;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 2px;

    .ant-form-item {
        flex: 1;
        margin-bottom: 0;
    }
`;

function ChatWindow() {
    const { selectedRoom, members, setIsInviteMemberVisible } = useContext(AppContext);
    const {
        user: { uid, photoURL, displayName },
    } = useContext(AuthContext);
    const [inputValue, setInputValue] = useState('');
    const [form] = Form.useForm();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!inputValue) return;

        try {
            await addDocument('messages', {
                text: inputValue,
                uid,
                photoURL,
                roomId: selectedRoom.id,
                displayName,
            });

            form.resetFields(['message']);
        } catch (error) {
            console.error(error);
        }
    };

    const messageCondition = useMemo(() => {
        return {
            fieldName: 'roomId',
            operator: '==',
            compareValue: selectedRoom.id || '___',
        };
    }, [selectedRoom.id]);

    const messages = useFirestore('messages', messageCondition);

    console.log({ messages });

    return (
        <WrapperStyled>
            {selectedRoom.id ? (
                <>
                    <HeaderStyled>
                        <div className="header__info">
                            <p className="header__title">{selectedRoom?.name}</p>
                            <span className="header__desc">{selectedRoom?.description}</span>
                        </div>
                        <ButtonGroupStyled>
                            <Button
                                type="text"
                                icon={<UserAddOutlined />}
                                onClick={() => setIsInviteMemberVisible(true)}
                            >
                                Mời
                            </Button>
                            <Avatar.Group size="small" max={2}>
                                {members.map((member) => (
                                    <Tooltip title={member.displayName} key={member.id}>
                                        <Avatar src={member.photoURL}>
                                            {member.photoURL ? '' : member.displayName?.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </Tooltip>
                                ))}
                            </Avatar.Group>
                        </ButtonGroupStyled>
                    </HeaderStyled>
                    <ContentStyled>
                        <MessageListStyled>
                            {messages.map((message) => (
                                <Message
                                    key={message.id}
                                    text={message.text}
                                    displayName={message.uid === uid ? 'Bạn' : message.displayName}
                                    createAt={message.createAt}
                                    photoURL={message.photoURL}
                                />
                            ))}
                        </MessageListStyled>
                        <FormStyled form={form}>
                            <Form.Item name="message">
                                <Input
                                    variant="filled"
                                    autoComplete="off"
                                    placeholder="Nhập tin nhắn..."
                                    onChange={handleInputChange}
                                    onPressEnter={handleSendMessage}
                                />
                            </Form.Item>
                            <Button type="primary" onClick={handleSendMessage}>
                                Send
                            </Button>
                        </FormStyled>
                    </ContentStyled>
                </>
            ) : (
                <Alert message="Hãy chọn phòng" type="info" showIcon style={{ margin: 5 }} closable />
            )}
        </WrapperStyled>
    );
}

export default ChatWindow;
