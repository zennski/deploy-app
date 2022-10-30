import React, {useState, useEffect} from 'react'
import {Button, Form, Grid, Loader} from "semantic-ui-react"
import {storage, db} from "../firebase"
import { useParams, useNavigate } from 'react-router-dom'
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import { addDoc, updateDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';

const initialState = {
    name: "",
    date: "",
    price: "",
    sold: ""
}

const AddEditUser = () => {
    const [data, setData] = useState(initialState);
    const {name, date, price, sold} = data;
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        id && getSingleUser();
    }, [id]);

    const getSingleUser = async () => {
        const docRef = doc(db, "products", id);
        const snapshot = await getDoc(docRef)
        if(snapshot.exists()) {
            setData({...snapshot.data() });
        }
    }

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name;
            const storageRef = ref(storage,file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
                switch(snapshot.state) {
                    case "paused":
                        console.log("Upload is Paused");
                        break;
                    case "running":
                        console.log("Upload is Running");
                        break;
                      default:
                        break;
                }
            }, (error) => {
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setData((prev) => ({...prev, img: downloadURL}));
                });
            }
            );
        };
        file && uploadFile()
    }, [file]);

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value });
    };
    
    const validate = () => {
        let errors = {};
        if(!name){
            errors.name = "Product Name is Required"
        }
        if(!date){
            errors.date = "Date of Purchase is Required"
        }
        if(!price){
            errors.price = "Product Price is Required"
        }
        if(!sold){
            errors.sold = "Number of Items Sold is Required"
        }

        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = validate();
        if (Object.keys(errors).length) return setErrors(errors);
        setIsSubmit(true);
        if(!id){
            try {
                await addDoc(collection(db, "products"), {
                    ...data,
                    timestamp: serverTimestamp(),
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                await updateDoc(doc(db, "products", id), {
                    ...data,
                    timestamp: serverTimestamp(),
                });
            } catch (error) {
                console.log(error);
            }
        }
            navigate("/");
    };
  return (
    <div>
        <Grid centered 
        verticalAlign='middle' 
        columns="3" 
        style={{height: "80vh"}}
    >
            <Grid.Row>
                <Grid.Column textAlign='center'>
                    <div>
                        {isSubmit ? (
                        <Loader active inline="centered" size="huge" />
                    ) : (
                        <>
                            <h2>{id ? "Update Product" : "Add Product"}</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Input
                                label="Product Name"
                                error={errors.name ? {content:errors.name} : null }
                                placeHolder="Enter Product Name"
                                name="name"
                                onChange={handleChange}
                                value={name}
                                autoFocus
                                />
                                <Form.Input
                                label="Date and Time Sold"
                                error={errors.date ? {content:errors.date} : null }
                                placeHolder="Enter Date of Purchase"
                                name="date"
                                onChange={handleChange}
                                value={date}
                                />
                                <Form.Input
                                label="Product Price"
                                error={errors.price ? {content:errors.price} : null }
                                placeHolder="Enter Product Price"
                                name="price"
                                onChange={handleChange}
                                value={price}
                                />
                                <Form.Input
                                label="Quantity Sold"
                                error={errors.sold ? {content:errors.sold} : null }
                                placeHolder="Enter Quantity Sold"
                                name="sold"
                                onChange={handleChange}
                                value={sold}
                                />
                                <Form.Input
                                label="Upload"
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                />
                                <Button primary 
                                type='submit' 
                                disabled={progress !== null && progress < 100}
                                >
                                    Submit
                                </Button>
                            </Form>
                        </>
                        )}
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </div>
  )
}

export default AddEditUser