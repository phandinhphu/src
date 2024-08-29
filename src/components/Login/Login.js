import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button } from 'antd';
import {
    auth,
    signInWithPopup,
    FacebookAuthProvider,
    onAuthStateChanged,
} from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/services';

const { Title } = Typography;

const fbProvider = new FacebookAuthProvider();
fbProvider.addScope('email');

function Login() {
    const navigate = useNavigate();

    const handleLoginFacebook = async () => {
        const { user } = await signInWithPopup(auth, fbProvider);

        // if (additionalUserInfo.isNewUser) {
        try {
            const docRef = await addDocument(('users'), {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                providerId: user.providerData[0].providerId,
                keywords: generateKeywords(user.displayName),
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding document: ', e);
        }
        // } else {
        //     console.log('Old user');
        // }
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            navigate('/');
            // ...
        } else {
            // User is signed out
            // ...
            console.log('User is signed out');
        }
    });

    return (
        <div>
            <Row justify="center">
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={3}>
                        Fun Chat
                    </Title>
                    <Button style={{ width: '100%', marginBottom: 5 }}>Đăng nhập với Google</Button>
                    <Button style={{ width: '100%' }} onClick={handleLoginFacebook}>
                        Đăng nhập với Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
