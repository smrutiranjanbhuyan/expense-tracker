import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";

const useFetchData = <T,>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) return;

    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as T[];
        setData(fetchedData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  return { data, loading, error };
};

export default useFetchData;
