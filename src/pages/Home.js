import React, {useEffect, useState} from 'react'
import {db} from "../firebase";
import {Button, Card, Grid, Container, Image} from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, snapshotEqual } from 'firebase/firestore';
import ModalComp from '../components/ModalComp';

const Home = () => {
  const [products, setproducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({id: doc.id, ...doc.data()})
      });
      setproducts(list);
      setLoading(false)
    }, 
    (error) => {
        console.log(error);
    }
   );

   return () => {
      unsub();
   };
  }, []);

  const handleModal = (item) => {
    setOpen(true);
    setUser(item);
  };

  return (
    <Container>
      <Card.Group>
        <Grid columns = {5} stackable>
          {products && 
           products.map((item) => (
            <Grid.Column key={item.id}>
              <Card>
                <Card.Content>
                  <Image 
                  src={item.img}
                  size="medium"
                  style={{
                    height: "150px",
                    width: "150px",
                  }}
                  />
                  <Card.Header style={{marginTop: "10px"}}>
                    {item.name}
                  </Card.Header>
                  <Card.Description>{item.date}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div>
                    <Button 
                    color="green" 
                    onClick={() => navigate(`/update/${item.id}`)}
                    >
                      Update
                    </Button>
                    <Button color="purple" onClick={() => handleModal(item)}> 
                      View 
                    </Button>
                    {open && (
                      <ModalComp 
                      open={open}
                      setOpen={setOpen}
                      handleDelete={() => console.log("delete")}
                      {...user}
                      />
                    )}
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
        </Grid>
      </Card.Group>
    </Container>
  )
};

export default Home