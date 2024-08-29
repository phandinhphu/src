import { useEffect, useState } from 'react';
import { onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db, collection } from '../firebase/config';

export const useFirestore = (collectionPara, condition) => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        let q = null;
        // condition
        /**
         * {
         *   fieldName: 'uid',
         *   operator: '==' for string, '>=', '<=', '>', '<' for number, 'in' for array
         *   compareValue: '123',
         * }
         */
        if (condition) {
            q = query(
                collection(db, collectionPara),
                where(condition.fieldName, condition.operator, condition.compareValue),
                orderBy('createAt'),
            );
        } else {
            q = query(collection(db, collectionPara), orderBy('createAt'));
        }

        const unsubscribed = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            console.log({ data, querySnapshot, docs: querySnapshot.docs });

            setDocs(data);
        });

        return () => unsubscribed();
    }, [collectionPara, condition]);

    return docs;
};
