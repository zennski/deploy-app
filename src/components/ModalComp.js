import React from 'react'
import {Modal, Header, Image, Button} from "semantic-ui-react"

const ModalComp = ({
    open, 
    setOpen, 
    img, 
    name, 
    date, 
    price, 
    sold, 
    id,
    handleDelete,
}) => {
  return (
    <Modal 
        onClose={() => setOpen(false)} 
        onOpen={() => setOpen(true)} 
        open={open}
    >
        <Modal.Header> Product Detail </Modal.Header>
        <Modal.Content image>
            <Image size="medium" src={img} wrapped/>
            <Modal.Description>
                <Header>{name}</Header>
                <p>Last Sold Date: {date}</p>
                <p>Product Price: {price}</p>
                <p>Total Products Sold: {sold}</p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
            Cancel
        </Button>
        <Button 
            color="red" 
            content="Delete" 
            labelPosition='right' 
            onClick={() => handleDelete(id)} />
            
        </Modal.Actions>
    </Modal>
  )
}

export default ModalComp