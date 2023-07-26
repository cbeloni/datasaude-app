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
              'N1 - BOA': 'green',
              'N2 - MODERADA': 'orange',
            }[card.qualidade] || 'red';

            
            
            return (    
              <Col md="3" key={card.id}>
                <Card
                  key={card.id}
                  text='black'
                  style={{ width: '18rem' }}
                  className="mb-2 card-stats"
                >
                <Card.Body align="center">
                    <Card.Text>
                    <strong> {card.nome} </strong>
                    <hr></hr>
                    </Card.Text>
                    <Card.Text style={{
                      color:  `${variante}`,
                      fontSize: "20px"
                    }}>
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
