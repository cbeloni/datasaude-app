import React, { useState } from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {

  const [data, setData] = useState();

  axios.put('http://datasaude-api.beloni.dev.br/api/v1/poluentes/cetesb?persist=false')
    .then((response) => {
      // Armazene a resposta da API no estado
      setData(response.data);
    })
    .catch((error) => {
      // Imprima o erro
      console.log(error);
    });

  return (
    <div>
      {data && (
        <Row>          
          {data.Payload.map((card) => {
            const variante = {
              'N1 - BOA': 'success',
              'N2 - MODERADA': 'warning',
            }[card.qualidade];

            
            
            return (    
              <Col md="3" key={card.id}>
                <Card
                  bg={variante || 'danger'}
                  key={card.id}
                  text='white'
                  style={{ width: '18rem' }}
                  className="mb-2"
                >
                <Card.Body align="center">
                    <Card.Text>
                    <strong> {card.nome} </strong>
                    <hr></hr>
                    </Card.Text>
                    <Card.Text>
                      Qualidade: {card.qualidade} 
                    </Card.Text>
                    <Card.Text>
                      Indice: {card.indice}
                    </Card.Text>                             
                  </Card.Body>
                  <Card.Footer align="center">
                  <div>
                    <i className="fas fa-redo mr-1"></i>
                    Atualizado: {card.data}
                  </div>
                </Card.Footer>
                </Card>
              </Col>
          )})}
        </Row>
      )}
    </div>
  );
}

export default Dashboard;
